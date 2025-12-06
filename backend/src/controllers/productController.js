import db from '../models/index.js';

const Products = db.Products;
const Bid = db.Bid;
const ProductsImage = db.ProductsImage;

export default {
    getLatestBidded: async (req, res) => {
        try {
            const products = await Products.findAll({
                attributes: {
                    include: [
                        [db.sequelize.literal('(SELECT MAX("bid_time") FROM "Bids" WHERE "Bids"."product_id" = "Products"."id")'), 'latest_bid_time']
                    ]
                },
                include: [
                    {
                        model: ProductsImage,
                        as: 'images',
                        attributes: ['image_url'],
                        where: { is_thumbnail: true },
                        required: false
                    }
                ],
                order: [[db.sequelize.literal('"latest_bid_time"'), 'DESC']],
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
            const products = await Products.findAll({
                attributes: {
                    include: [
                        [db.sequelize.fn('COUNT', db.sequelize.col('bids.bid_id')), 'bid_count']
                    ]
                },
                include: [
                    {
                        model: Bid,
                        as: 'bids',
                        attributes: []
                    },
                    {
                        model: ProductsImage,
                        as: 'images',
                        attributes: ['image_url'],
                        where: { is_thumbnail: true },
                        required: false
                    }
                ],
                group: ['Products.id', 'images.id'],
                order: [[db.sequelize.col('bid_count'), 'DESC']],
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
            const products = await Products.findAll({
                include: [
                    {
                        model: ProductsImage,
                        as: 'images',
                        attributes: ['image_url'],
                        where: { is_thumbnail: true },
                        required: false
                    }
                ],
                order: [['current_price', 'DESC']],
                limit: 5
            });
            res.json(products);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching highest price products' });
        }
    },

    getByCategory: async (req, res) => {
        try {
            const { id } = req.params;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 12;
            const sort = req.query.sort || 'default';
            const offset = (page - 1) * limit;

            let order = [['post_date', 'DESC']];
            if (sort === 'price_asc') {
                order = [['current_price', 'ASC']];
            } else if (sort === 'time_desc') {
                order = [['end_date', 'DESC']];
            }

            const products = await Products.findAll({
                where: { category_id: id },
                attributes: {
                    include: [
                        [db.sequelize.fn('COUNT', db.sequelize.col('bids.bid_id')), 'bid_count']
                    ]
                },
                include: [
                    {
                        model: Bid,
                        as: 'bids',
                        attributes: []
                    },
                    {
                        model: ProductsImage,
                        as: 'images',
                        attributes: ['image_url'],
                        where: { is_thumbnail: true },
                        required: false
                    },
                    {
                        model: db.Users,
                        as: 'current_winner',
                        attributes: ['name']
                    }
                ],
                group: ['Products.id', 'images.id', 'current_winner.id'],
                order: order,
                limit: limit,
                offset: offset,
                subQuery: false
            });

            const totalItems = await Products.count({ where: { category_id: id } });

            res.json({
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: page,
                products: products
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching products by category' });
        }
    },

    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const product = await Products.findByPk(id, {
                attributes: {
                    include: [
                        [db.sequelize.fn('COUNT', db.sequelize.col('bids.bid_id')), 'bid_count']
                    ]
                },
                include: [
                    {
                        model: Bid,
                        as: 'bids',
                        attributes: []
                    },
                    {
                        model: ProductsImage,
                        as: 'images',
                        attributes: ['image_url', 'is_thumbnail']
                    },
                    {
                        model: db.Users,
                        as: 'seller',
                        attributes: ['id', 'name', 'email']
                    },
                    {
                        model: db.Categories,
                        as: 'category',
                        attributes: ['id', 'name']
                    },
                    {
                        model: db.Users,
                        as: 'current_winner',
                        attributes: ['name']
                    }
                ],
                group: ['Products.id', 'images.id', 'seller.id', 'category.id', 'current_winner.id']
            });

            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            res.json(product);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching product details' });
        }
    },

    getAll: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 12;
            const sort = req.query.sort || 'default';
            const offset = (page - 1) * limit;

            let order = [['post_date', 'DESC']];
            if (sort === 'price_asc') {
                order = [['current_price', 'ASC']];
            } else if (sort === 'time_desc') {
                order = [['end_date', 'DESC']];
            }

            const products = await Products.findAll({
                attributes: {
                    include: [
                        [db.sequelize.fn('COUNT', db.sequelize.col('bids.bid_id')), 'bid_count']
                    ]
                },
                include: [
                    {
                        model: Bid,
                        as: 'bids',
                        attributes: []
                    },
                    {
                        model: ProductsImage,
                        as: 'images',
                        attributes: ['image_url'],
                        where: { is_thumbnail: true },
                        required: false
                    },
                    {
                        model: db.Users,
                        as: 'current_winner',
                        attributes: ['name']
                    }
                ],
                group: ['Products.id', 'images.id', 'current_winner.id'],
                order: order,
                limit: limit,
                offset: offset,
                subQuery: false
            });

            const totalItems = await Products.count();

            res.json({
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: page,
                products: products
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching all products' });
        }
    },

    search: async (req, res) => {
        try {
            const { q } = req.query;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 12;
            const sort = req.query.sort || 'default';
            const offset = (page - 1) * limit;

            if (!q) {
                return res.status(400).json({ message: 'Search query is required' });
            }

            let order = [['post_date', 'DESC']];
            if (sort === 'price_asc') {
                order = [['current_price', 'ASC']];
            } else if (sort === 'time_desc') {
                order = [['end_date', 'DESC']];
            }

            const products = await Products.findAll({
                where: db.sequelize.literal(`"full_text_search" @@ plainto_tsquery('english', :query)`),
                replacements: { query: q },
                attributes: {
                    include: [
                        [db.sequelize.fn('COUNT', db.sequelize.col('bids.bid_id')), 'bid_count']
                    ]
                },
                include: [
                    {
                        model: Bid,
                        as: 'bids',
                        attributes: []
                    },
                    {
                        model: ProductsImage,
                        as: 'images',
                        attributes: ['image_url'],
                        where: { is_thumbnail: true },
                        required: false
                    },
                    {
                        model: db.Users,
                        as: 'current_winner',
                        attributes: ['name']
                    }
                ],
                group: ['Products.id', 'images.id', 'current_winner.id'],
                order: order,
                limit: limit,
                offset: offset,
                subQuery: false
            });

            const totalItems = await Products.count({
                where: db.sequelize.literal(`"full_text_search" @@ plainto_tsquery('english', :query)`),
                replacements: { query: q }
            });

            res.json({
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: page,
                products: products
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error searching products' });
        }
    },

    placeBid: async (req, res) => {
        const t = await db.sequelize.transaction();
        try {
            const { id } = req.params;
            const { amount } = req.body;
            const userId = req.user.id;

            const product = await Products.findByPk(id, { lock: true, transaction: t });

            if (!product) {
                await t.rollback();
                return res.status(404).json({ message: 'Product not found' });
            }

            if (product.seller_id === userId) {
                await t.rollback();
                return res.status(400).json({ message: 'You cannot bid on your own product' });
            }

            if (new Date(product.end_date) < new Date()) {
                await t.rollback();
                return res.status(400).json({ message: 'Auction has ended' });
            }

            if (parseFloat(amount) <= parseFloat(product.current_price)) {
                await t.rollback();
                return res.status(400).json({ message: 'Bid amount must be higher than current price' });
            }

            // Create bid
            await Bid.create({
                bidder_id: userId,
                product_id: id,
                amount: amount,
                max_bid_amount: amount, // Assuming simple bidding for now
                bid_time: new Date()
            }, { transaction: t });

            // Update product
            await product.update({
                current_price: amount,
                current_winner_id: userId
            }, { transaction: t });

            await t.commit();
            res.json({ message: 'Bid placed successfully' });
        } catch (error) {
            await t.rollback();
            console.error(error);
            res.status(500).json({ message: 'Error placing bid' });
        }
    },

};
