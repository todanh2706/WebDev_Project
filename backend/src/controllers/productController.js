import db from '../models/index.js';

const Products = db.Products;
const Bid = db.Bid;
const ProductsImage = db.ProductsImage;
const SystemSettings = db.SystemSettings;

const BidPermissionRequest = db.BidPermissionRequest;
const Feedbacks = db.Feedbacks;
import fs from 'fs';

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

    getMyProducts: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 12;
            const offset = (page - 1) * limit;

            const products = await Products.findAll({
                where: { seller_id: req.user.id },
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
                order: [['createdAt', 'DESC']],
                limit: limit,
                offset: offset,
                subQuery: false
            });

            const totalItems = await Products.count({ where: { seller_id: req.user.id } });

            res.json({
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: page,
                products: products
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching my products' });
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
                    },
                    {
                        model: db.Categories,
                        as: 'category',
                        attributes: ['name']
                    }
                ],
                group: ['Products.id', 'images.id', 'current_winner.id', 'category.id'],
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

            const minBidAmount = parseFloat(product.current_price) + parseFloat(product.step_price);
            if (parseFloat(amount) < minBidAmount) {
                await t.rollback();
                return res.status(400).json({ message: `Bid amount must be at least $${minBidAmount.toLocaleString()} (Current Price + Step Price)` });
            }

            // Check eligibility
            const ratings = await Feedbacks.findAll({ where: { target_user_id: userId } });
            const totalRatings = ratings.length;
            const goodRatings = ratings.filter(r => r.rating === 'good').length;
            const score = totalRatings > 0 ? (goodRatings / totalRatings) * 100 : 100;

            // Must have >= 5 ratings and >= 80% score.
            // If not, must have approved permission request.
            let isEligible = totalRatings >= 5 && score >= 80;

            if (!isEligible) {
                const permission = await BidPermissionRequest.findOne({
                    where: {
                        user_id: userId,
                        product_id: id,
                        status: 'approved'
                    }
                });

                if (!permission) {
                    await t.rollback();
                    return res.status(403).json({
                        message: 'You are not eligible to bid on this product. Please request permission from the seller.',
                        requiresPermission: true
                    });
                }

                // Check expiration (7 days)
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                if (new Date(permission.createdAt) < sevenDaysAgo) {
                    await t.rollback();
                    return res.status(403).json({
                        message: 'Your bid permission has expired (7 days limit). Please request permission again.',
                        requiresPermission: true,
                        status: 'expired'
                    });
                }
            }

            // Create bid
            await Bid.create({
                bidder_id: userId,
                product_id: id,
                amount: amount,
                max_bid_amount: amount,
                bid_time: new Date()
            }, { transaction: t });

            // Auto-extension logic
            let newEndDate = null;
            if (product.is_auto_extend) {
                const settings = await SystemSettings.findAll({ transaction: t });
                const settingsMap = {};
                settings.forEach(s => settingsMap[s.key] = s.value);

                const thresholdMinutes = parseInt(settingsMap['auction_threshold_minutes'] || '5');
                const extensionMinutes = parseInt(settingsMap['auction_extension_minutes'] || '10');

                const now = new Date();
                const endDate = new Date(product.end_date);
                const timeRemainingMillis = endDate.getTime() - now.getTime();
                const thresholdMillis = thresholdMinutes * 60 * 1000;

                console.log('***** Auto Extension Debug *****');
                console.log('Product ID:', product.id);
                console.log('Is Auto Extend:', product.is_auto_extend);
                console.log('Now:', now.toISOString());
                console.log('End Date:', endDate.toISOString());
                console.log('Time Remaining (ms):', timeRemainingMillis);
                console.log('Threshold (ms):', thresholdMillis);
                console.log('Settings:', settingsMap);

                if (timeRemainingMillis > 0 && timeRemainingMillis <= thresholdMillis) {
                    newEndDate = new Date(endDate.getTime() + (extensionMinutes * 60 * 1000));
                    console.log('***** EXTENDING AUCTION to:', newEndDate.toISOString());
                } else {
                    console.log('***** Condition NOT met for extension.');
                }
            } else {
                console.log('***** Auto Extension Debug: Product is NOT auto-extend *****');
            }

            // Update product
            const updateData = {
                current_price: amount,
                current_winner_id: userId,
                buy_now_price: null // Remove Buy Now option once a bid is placed
            };

            if (newEndDate) {
                updateData.end_date = newEndDate;
            }

            await product.update(updateData, { transaction: t });

            await t.commit();
            res.json({ message: 'Bid placed successfully' });
        } catch (error) {
            await t.rollback();
            console.error(error);
            res.status(500).json({ message: 'Error placing bid' });
        }
    },

    requestBidPermission: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const existingRequest = await BidPermissionRequest.findOne({
                where: {
                    user_id: userId,
                    product_id: id
                }
            });

            if (existingRequest) {
                return res.status(400).json({ message: 'Request already sent', status: existingRequest.status });
            }

            await BidPermissionRequest.create({
                user_id: userId,
                product_id: id,
                status: 'pending'
            });

            res.json({ message: 'Permission request sent successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error sending permission request' });
        }
    },

    checkBidPermission: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const request = await BidPermissionRequest.findOne({
                where: {
                    user_id: userId,
                    product_id: id
                }
            });

            if (request) {
                // Check expiration (7 days)
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

                if (new Date(request.createdAt) < sevenDaysAgo) {
                    return res.json({ status: 'expired' });
                }
            }

            res.json({ status: request ? request.status : null });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error checking permission status' });
        }
    },

    getSellerBidRequests: async (req, res) => {
        try {
            const sellerId = req.user.id;
            const { productId } = req.query;

            const whereClause = { seller_id: sellerId };
            if (productId) {
                whereClause.id = productId;
            }

            const requests = await BidPermissionRequest.findAll({
                include: [
                    {
                        model: Products,
                        as: 'product',
                        where: whereClause,
                        attributes: ['id', 'name']
                    },
                    {
                        model: db.Users,
                        as: 'user',
                        attributes: ['id', 'name', 'email'] // Add rating info if needed
                    }
                ],
                order: [['createdAt', 'DESC']]
            });

            res.json(requests);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching bid requests' });
        }
    },

    handleBidRequest: async (req, res) => {
        try {
            const { requestId } = req.params;
            const { status } = req.body; // 'approved' or 'rejected'
            const sellerId = req.user.id;

            const request = await BidPermissionRequest.findByPk(requestId, {
                include: [
                    {
                        model: Products,
                        as: 'product'
                    }
                ]
            });

            if (!request) {
                return res.status(404).json({ message: 'Request not found' });
            }

            if (request.product.seller_id !== sellerId) {
                return res.status(403).json({ message: 'Unauthorized' });
            }

            await request.update({ status });

            res.json({ message: `Request ${status} successfully` });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error updating request' });
        }
    },

    createProduct: async (req, res) => {
        const t = await db.sequelize.transaction();
        try {
            const { name, category_id, description, starting_price, step_price, buy_now_price, is_auto_extend, end_date } = req.body;
            const sellerId = req.user.id;
            const files = req.files;

            // Validation
            if (!files || files.length < 3) {
                await t.rollback();
                // Clean up uploaded files
                if (files) {
                    files.forEach(file => fs.unlinkSync(file.path));
                }
                return res.status(400).json({ message: 'At least 3 photos are required' });
            }

            // Create product
            const product = await Products.create({
                seller_id: sellerId,
                category_id,
                name,
                description,
                starting_price,
                current_price: starting_price,
                step_price,
                buy_now_price: buy_now_price || null,
                post_date: new Date(),
                end_date: end_date ? new Date(end_date) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 7 days if not provided
                is_auto_extend: is_auto_extend === 'true', // FormData sends strings
                status: 'active'
            }, { transaction: t });

            // Create images
            const imagePromises = files.map((file, index) => {
                return ProductsImage.create({
                    product_id: product.id,
                    image_url: `/uploads/products/${file.filename}`,
                    is_thumbnail: index === 0
                }, { transaction: t });
            });

            await Promise.all(imagePromises);

            await t.commit();
            res.status(201).json({ message: 'Product created successfully', product });
        } catch (error) {
            await t.rollback();
            // Clean up uploaded files
            if (req.files) {
                req.files.forEach(file => {
                    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
                });
            }
            console.error(error);
            res.status(500).json({ message: 'Error creating product' });
        }
    },

    appendDescription: async (req, res) => {
        try {
            const { id } = req.params;
            const { description } = req.body;
            const userId = req.user.id;

            if (!description || !description.trim()) {
                return res.status(400).json({ message: 'Description text is required' });
            }

            const product = await Products.findByPk(id);

            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            if (product.seller_id !== userId) {
                return res.status(403).json({ message: 'Unauthorized' });
            }

            const timestamp = new Date().toLocaleString();
            const appendText = `\n\n<hr class="my-3 border-secondary" /><p class="mb-1"><strong class="text-warning">Update [${timestamp}]:</strong></p><p>${description}</p>`;

            const newDescription = (product.description || '') + appendText;

            await product.update({ description: newDescription });

            res.json({ message: 'Description updated successfully', description: newDescription });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error updating description' });
        }
    }
};
