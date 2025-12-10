import db from '../models/index.js';
import { Op } from 'sequelize';

const { Products, Bid } = db;

export const checkExpiredAuctions = async () => {
    try {
        const now = new Date();

        // Find all active products that have expired
        const expiredProducts = await Products.findAll({
            where: {
                status: 'active',
                end_date: {
                    [Op.lt]: now
                }
            }
        });

        if (expiredProducts.length > 0) {
            console.log(`Found ${expiredProducts.length} expired auctions. Processing...`);

            for (const product of expiredProducts) {
                const t = await db.sequelize.transaction();

                try {
                    // Check for the highest bid
                    const highestBid = await Bid.findOne({
                        where: { product_id: product.id },
                        order: [['amount', 'DESC']],
                        transaction: t
                    });

                    if (highestBid) {
                        // Auction won
                        product.status = 'sold';
                        product.current_winner_id = highestBid.bidder_id;
                        product.current_price = highestBid.amount; // Ensure price reflects winning bid
                        console.log(`Auction ${product.id} WON by user ${highestBid.bidder_id}`);
                    } else {
                        // No bids, auction expired
                        product.status = 'expired';
                        console.log(`Auction ${product.id} EXPIRED with no bids`);
                    }

                    await product.save({ transaction: t });
                    await t.commit();

                } catch (productError) {
                    await t.rollback();
                    console.error(`Error processing expired auction ${product.id}:`, productError);
                }
            }
        }
    } catch (error) {
        console.error('Error checking expired auctions:', error);
    }
};
