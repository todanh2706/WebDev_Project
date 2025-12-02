import db from '../models/index.js';
import seedProducts from '../database/seeders/productSeeder.js';
import { seedCategories } from '../database/seeders/categorySeeder.js';
const Product = db.Product;
const Bid = db.Bid;
const User = db.User;

export default {
    getLatestBidded: async (req, res) => {
        try {
            const products = await Product.findAll({
                attributes: {
                    include: [
                        [db.sequelize.literal('(SELECT MAX("createdAt") FROM "Bids" WHERE "Bids"."productId" = "Product"."id")'), 'latestBidTime']
                    ]
                },
                order: [[db.sequelize.literal('"latestBidTime"'), 'DESC']],
                limit: 5
            });
            res.json(products);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching latest bidded products' });
        }
    },

    getMostBidded: async (req, res) => {
        try {
            const products = await Product.findAll({
                attributes: {
                    include: [
                        [db.sequelize.fn('COUNT', db.sequelize.col('bids.id')), 'bidCount']
                    ]
                },
                include: [{
                    model: Bid,
                    as: 'bids',
                    attributes: []
                }],
                group: ['Product.id'],
                order: [[db.sequelize.col('bidCount'), 'DESC']],
                limit: 5,
                subQuery: false
            });
            res.json(products);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching most bidded products' });
        }
    },

    getHighestPrice: async (req, res) => {
        try {
            const products = await Product.findAll({
                order: [['currentPrice', 'DESC']],
                limit: 5
            });
            res.json(products);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching highest price products' });
        }
    },

    seed: async (req, res) => {
        try {
            await seedCategories();
            await seedProducts();
            res.json({ message: "Database seeded successfully" });
        } catch (error) {
            console.error("Error seeding database:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
};
