import cron from 'node-cron';
import { Op } from 'sequelize';
import db from '../models/index.js';
import { sendAuctionWonEmail, sendAuctionSoldEmail } from './emailService.js';

const { Products, Bid, Users } = db;

export const initAuctionCron = () => {
    // Run every minute
    cron.schedule('* * * * *', async () => {
        // console.log('Running auction check cron job...');
        const t = await db.sequelize.transaction();

        try {
            const now = new Date();

            // Find products that have ended but are still 'active'
            const products = await Products.findAll({
                where: {
                    end_date: {
                        [Op.lt]: now
                    },
                    status: 'active'
                },
                include: [
                    {
                        model: Bid,
                        as: 'bids',
                        include: [
                            {
                                model: Users,
                                as: 'bidder',
                                required: true
                            }
                        ],
                        order: [['amount', 'DESC']],
                        limit: 1
                    },
                    {
                        model: Users,
                        as: 'seller',
                        required: true
                    }
                ],
                transaction: t,
                lock: true
            });

            if (products.length > 0) {
                console.log(`Found ${products.length} expired auctions.`);
            }

            for (const product of products) {
                if (product.bids && product.bids.length > 0) {
                    // Has winner
                    const winningBid = product.bids[0];
                    const winner = winningBid.bidder;

                    product.current_winner_id = winner.id;
                    product.status = 'sold';
                    product.current_price = winningBid.amount;

                    await product.save({ transaction: t });

                    // Send Emails
                    if (winner) {
                        await sendAuctionWonEmail(winner.email, winner.name, product.name, winningBid.amount);
                    }
                    if (product.seller) {
                        await sendAuctionSoldEmail(product.seller.email, product.seller.name, product.name, winningBid.amount, winner ? winner.name : 'Unknown');
                    }

                    console.log(`Auction closed for ${product.id}. Winner: ${winner.id}`);
                } else {
                    // No bids
                    product.status = 'expired';
                    await product.save({ transaction: t });
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
