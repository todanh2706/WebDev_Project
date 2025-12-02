import db from '../models/index.js';
import seedProducts from '../database/seeders/productSeeder.js';
const { Product, Bid, User } = db;

const ProductController = {
    getLatestBidded: async (req, res) => {
        try {
            const products = await Product.findAll({
                include: [{
                    model: Bid,
                    as: 'bids',
                    attributes: ['createdAt'],
                    order: [['createdAt', 'DESC']],
                    limit: 1
                }],
                order: [
                    [{ model: Bid, as: 'bids' }, 'createdAt', 'DESC']
                ],
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

    seedProducts: async (req, res) => {
        try {
            await seedProducts();
            res.json({ message: 'Database seeded successfully!' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error seeding database' });
        }
    }
};

export default ProductController;
