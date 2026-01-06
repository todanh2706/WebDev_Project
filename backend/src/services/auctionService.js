import cron from 'node-cron';
import { Op } from 'sequelize';
import db from '../models/index.js';
import { sendAuctionWonEmail, sendAuctionSoldEmail, sendAuctionEndedNoWinnerEmail } from './emailService.js';

const { Products, Bid, Users } = db;

export const initAuctionCron = () => {
    // Run every minute
    cron.schedule('* * * * *', async () => {
        // console.log('Running auction check cron job...');
        const t = await db.sequelize.transaction();

        try {
            const now = new Date();

            // Find products that have ended but are still 'active'
            // Find products that have ended but are still 'active'
            // NOTE: We avoid complex includes with 'limit' here because Sequelize generates a UNION query 
            // which allows 'FOR UPDATE' only in specific Postgres versions/configurations, often failing.
            const products = await Products.findAll({
                where: {
                    end_date: {
                        [Op.lt]: now
                    },
                    status: 'active'
                },
                include: [
                    {
                        model: Users,
                        as: 'seller',
                        required: true
                    }
                ],
                transaction: t,
                lock: true // Lock the product rows
            });

            if (products.length > 0) {
                console.log(`Found ${products.length} expired auctions.`);
            }

            for (const product of products) {
                // Fetch the winning bid manually to avoid the UNION/LOCK issue
                const winningBid = await Bid.findOne({
                    where: { product_id: product.id },
                    include: [{ model: Users, as: 'bidder', required: true }],
                    order: [['amount', 'DESC']],
                    transaction: t
                });

                if (winningBid) {
                    // Has winner
                    const winner = winningBid.bidder;


                    product.current_winner_id = winner.id;
                    product.status = 'sold';
                    // product.current_price is already up-to-date from placeBid logic. Do not overwrite.

                    await product.save({ transaction: t });

                    // Send Emails
                    if (winner) {
                        await sendAuctionWonEmail(winner.email, winner.name, product.name, product.current_price, product.id);
                    }
                    if (product.seller) {
                        await sendAuctionSoldEmail(product.seller.email, product.seller.name, product.name, product.current_price, winner ? winner.name : 'Unknown');
                    }

                    console.log(`Auction closed for ${product.id}. Winner: ${winner.id}`);
                } else {
                    // No bids
                    product.status = 'expired';
                    await product.save({ transaction: t });

                    if (product.seller) {
                        await sendAuctionEndedNoWinnerEmail(product.seller.email, product.seller.name, product.name);
                    }

                    console.log(`Auction expired for ${product.id} with no bids.`);
                }
            }

            await t.commit();
        } catch (error) {
            await t.rollback();
            console.error('Error in cron job:', error);
        }
    });

    console.log('Auction Cron Job initialized (running every minute).');
};
