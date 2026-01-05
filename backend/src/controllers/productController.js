import db from '../models/index.js';

const Products = db.Products;
const Bid = db.Bid;
const ProductsImage = db.ProductsImage;
const SystemSettings = db.SystemSettings;

const BidPermissionRequest = db.BidPermissionRequest;
const Feedbacks = db.Feedbacks;
const BannedBidders = db.BannedBidders;
import { sendKickedNotification } from '../services/emailService.js';
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
            const { amount } = req.body; // This is the User's Bid
            const userId = req.user.id;

            const product = await Products.findByPk(id, { lock: true, transaction: t });

            if (!product) {
                await t.rollback();
                return res.status(404).json({ message: 'Product not found' });
            }

            const isBanned = await BannedBidders.findOne({
                where: { user_id: userId, product_id: id },
                transaction: t
            });

            if (isBanned) {
                await t.rollback();
                return res.status(403).json({ message: 'You have been banned from bidding on this product.' });
            }

            if (product.seller_id === userId) {
                await t.rollback();
                return res.status(400).json({ message: 'You cannot bid on your own product' });
            }

            if (new Date(product.end_date) < new Date()) {
                await t.rollback();
                return res.status(400).json({ message: 'Auction has ended' });
            }

            // Eligibility Check
            const ratings = await Feedbacks.findAll({ where: { target_user_id: userId } });
            const totalRatings = ratings.length;
            const goodRatings = ratings.filter(r => r.rating === 'good').length;
            const score = totalRatings > 0 ? (goodRatings / totalRatings) * 100 : 100;
            let isEligible = totalRatings >= 5 && score >= 80;

            if (!isEligible) {
                const permission = await BidPermissionRequest.findOne({
                    where: { user_id: userId, product_id: id, status: 'approved' }
                });

                if (!permission) {
                    await t.rollback();
                    return res.status(403).json({ message: 'Not eligible (Score < 80% or < 5 ratings). Request permission.', requiresPermission: true });
                }
            }

            let biddingMode = 'AUTO';
            const setting = await SystemSettings.findOne({ where: { key: 'BIDDING_MODE' } });
            if (setting) {
                biddingMode = setting.value;
            }

            const stepPrice = parseFloat(product.step_price);
            const currentPrice = parseFloat(product.current_price);
            const userBidAmount = parseFloat(amount);

            const existingBidsCount = await Bid.count({ where: { product_id: id }, transaction: t });

            let minValidBid = currentPrice + stepPrice;
            if (existingBidsCount === 0) {
                minValidBid = parseFloat(product.starting_price);
            }

            if (userBidAmount < minValidBid) {
                await t.rollback();
                return res.status(400).json({ message: `Bid must be at least $${minValidBid.toLocaleString('vi-VN')}` });
            }

            let newCurrentPrice = currentPrice;
            let newWinnerId = product.current_winner_id;

            if (biddingMode === 'NORMAL') {
                newCurrentPrice = userBidAmount;
                newWinnerId = userId;

                await Bid.create({
                    bidder_id: userId,
                    product_id: id,
                    amount: userBidAmount,
                    max_bid_amount: userBidAmount,
                    bid_time: new Date()
                }, { transaction: t });

            } else {
                // AUTO BIDDING LOGIC
                const allBids = await Bid.findAll({
                    where: { product_id: id },
                    order: [['max_bid_amount', 'DESC'], ['bid_time', 'ASC']],
                    transaction: t
                });

                const userMaxBids = {};
                allBids.forEach(bid => {
                    const bAmt = parseFloat(bid.max_bid_amount);
                    if (!userMaxBids[bid.bidder_id] || bAmt > userMaxBids[bid.bidder_id].amount) {
                        userMaxBids[bid.bidder_id] = { amount: bAmt, time: bid.bid_time };
                    }
                });

                // Add or Upate Current User
                userMaxBids[userId] = { amount: userBidAmount, time: new Date() };

                const sortedBidders = Object.keys(userMaxBids).map(uid => ({
                    userId: parseInt(uid),
                    amount: userMaxBids[uid].amount,
                    time: userMaxBids[uid].time
                })).sort((a, b) => {
                    if (b.amount !== a.amount) return b.amount - a.amount;
                    return new Date(a.time) - new Date(b.time);
                });

                const winner = sortedBidders[0];
                const runnerUp = sortedBidders[1];

                newWinnerId = winner.userId;

                if (!runnerUp) {
                    // Solo Bidder
                    if (existingBidsCount === 0) {
                        newCurrentPrice = parseFloat(product.starting_price);
                    } else {
                        newCurrentPrice = currentPrice;
                    }

                    // Record Bid
                    await Bid.create({
                        bidder_id: userId,
                        product_id: id,
                        amount: newCurrentPrice,
                        max_bid_amount: userBidAmount,
                        bid_time: new Date()
                    }, { transaction: t });

                } else {
                    // Competition
                    // Price is ALWAYS RunnerUp + Step (Capped at Winner Max)
                    newCurrentPrice = runnerUp.amount + stepPrice;

                    if (newCurrentPrice > winner.amount) {
                        newCurrentPrice = winner.amount;
                    }

                    // Logic for Recording Bids
                    if (newWinnerId === userId) {
                        // User Won (Overtake or First/Solo)
                        // Record User's Bid at Calculated Price
                        await Bid.create({
                            bidder_id: userId,
                            product_id: id,
                            amount: newCurrentPrice,
                            max_bid_amount: userBidAmount,
                            bid_time: new Date()
                        }, { transaction: t });
                    } else {
                        // User Lost (Defense triggered)
                        // 1. Record User's Bid at their Max (since they were pushed to limit)
                        // Or should it be RunnerUp Amount?
                        // If I bid 1600, and price goes to 1650.
                        // My bid at 1600 should be visible.
                        await Bid.create({
                            bidder_id: userId,
                            product_id: id,
                            amount: userBidAmount, // They bid 1600, they essentially offered 1600
                            max_bid_amount: userBidAmount,
                            bid_time: new Date()
                        }, { transaction: t });

                        // 2. Record Auto-Bid for Winner
                        await Bid.create({
                            bidder_id: winner.userId,
                            product_id: id,
                            amount: newCurrentPrice, // 1650
                            max_bid_amount: winner.amount, // 2000
                            bid_time: new Date() // Technically slight delay but essentially same transaction
                        }, { transaction: t });
                    }
                }
            }

            // Auto-extension logic
            let newEndDate = null;
            if (product.is_auto_extend) {
                const now = new Date();
                const endDate = new Date(product.end_date);
                if ((endDate.getTime() - now.getTime()) <= 5 * 60 * 1000) {
                    newEndDate = new Date(endDate.getTime() + 10 * 60 * 1000);
                }
            }

            // Update Product
            const updateData = {
                current_winner_id: newWinnerId,
                current_price: newCurrentPrice,
                buy_now_price: null
            };
            if (newEndDate) updateData.end_date = newEndDate;

            await product.update(updateData, { transaction: t });

            await t.commit();

            if (biddingMode === 'AUTO' && newWinnerId !== userId) {
                return res.json({ message: 'Bid placed, but you were outbidded by an automatic bid!', outbidded: true, current_price: newCurrentPrice });
            }

            res.json({ message: 'Bid placed successfully', current_price: newCurrentPrice });
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
    },

    getProductBids: async (req, res) => {
        try {
            const { id } = req.params;
            const bids = await Bid.findAll({
                where: { product_id: id },
                include: [
                    {
                        model: db.Users,
                        as: 'bidder',
                        attributes: ['id', 'name']
                    }
                ],
                order: [['bid_time', 'DESC']]
            });

            // Mask bidder names for privacy
            const maskedBids = bids.map(bid => {
                const plainBid = bid.get({ plain: true });
                if (plainBid.bidder && plainBid.bidder.name) {
                    const nameParts = plainBid.bidder.name.trim().split(' ');
                    if (nameParts.length > 1) {
                        // Keep only the last name, mask the rest
                        plainBid.bidder.name = '***** ' + nameParts[nameParts.length - 1];
                    } else {
                        // If single name, mask first half
                        const name = plainBid.bidder.name;
                        const visibleLen = Math.ceil(name.length / 2);
                        plainBid.bidder.name = '*****' + name.slice(-visibleLen);
                    }
                }
                return plainBid;
            });

            res.json(maskedBids);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching product bids' });
        }
    },

    rejectBid: async (req, res) => {
        const t = await db.sequelize.transaction();
        try {
            const { productId, bidId } = req.params;
            const userId = req.user.id; // Requester (Seller)

            const product = await Products.findByPk(productId, { transaction: t });
            if (!product) {
                await t.rollback();
                return res.status(404).json({ message: 'Product not found' });
            }

            // Verify seller
            if (product.seller_id !== userId) {
                await t.rollback();
                return res.status(403).json({ message: 'Only the seller can reject bids for this product' });
            }

            const bid = await Bid.findOne({
                where: {
                    bid_id: bidId,
                    product_id: productId
                },
                transaction: t,
                include: [{
                    model: db.Users,
                    as: 'bidder',
                    attributes: ['id', 'name', 'email']
                }]
            });

            if (!bid) {
                await t.rollback();
                return res.status(404).json({ message: 'Bid not found' });
            }

            // Ban the user from future bids on this product
            await BannedBidders.findOrCreate({
                where: {
                    user_id: bid.bidder_id,
                    product_id: productId
                },
                transaction: t
            });

            // Send notification
            if (bid.bidder && bid.bidder.email) {
                await sendKickedNotification(bid.bidder.email, product.name);
            }

            // Delete the bid
            await bid.destroy({ transaction: t });

            // Recalculate product state
            // Find the new highest bid
            const highestBid = await Bid.findOne({
                where: { product_id: productId },
                order: [['amount', 'DESC']],
                transaction: t
            });

            if (highestBid) {
                product.current_price = highestBid.amount;
                product.current_winner_id = highestBid.bidder_id;
            } else {
                // No bids left, reset to starting price
                product.current_price = product.starting_price;
                product.current_winner_id = null;
            }

            await product.save({ transaction: t });

            await t.commit();
            res.json({ message: 'Bid rejected successfully', product });
        } catch (error) {
            await t.rollback();
            console.error('Error rejecting bid:', error);
            res.status(500).json({ message: 'Error rejecting bid' });
        }
    },

    cancelTransaction: async (req, res) => {
        const t = await db.sequelize.transaction();
        try {
            const { id } = req.params;
            const sellerId = req.user.id;

            const product = await Products.findByPk(id, { transaction: t });

            if (!product) {
                await t.rollback();
                return res.status(404).json({ message: 'Product not found' });
            }

            if (product.seller_id !== sellerId) {
                await t.rollback();
                return res.status(403).json({ message: 'Unauthorized' });
            }

            if (!product.current_winner_id) {
                await t.rollback();
                return res.status(400).json({ message: 'This product does not have a winner to cancel.' });
            }

            const winnerId = product.current_winner_id;

            // 1. Create Negative Feedback
            // Check if feedback already exists to avoid duplicates (optional but good practice)
            const existingFeedback = await Feedbacks.findOne({
                where: {
                    product_id: id,
                    reviewer_id: sellerId,
                    target_user_id: winnerId
                },
                transaction: t
            });

            if (!existingFeedback) {
                await Feedbacks.create({
                    product_id: id,
                    reviewer_id: sellerId,
                    target_user_id: winnerId,
                    rating: 'bad',
                    comment: 'Người thắng không thanh toán'
                }, { transaction: t });
            }

            // 2. Remove Winner and Reset Status
            // Logic: We are cancelling the result. The requirement says "cancel transaction".
            // We should arguably also mark the user as 'banned' from this product if the auction is somehow reopened,
            // but usually 'cancel transaction' happens after end_date.
            // If we just remove the winner, the product status effectively becomes 'expired' without a winner (unsold).

            product.current_winner_id = null;
            // Ensure status is appropriate. If end_date is past, it's expired.
            // If we wanted to re-open it, we'd need to extend end_date. 
            // For now, let's keep it simple: just remove the winner. The product remains 'sold' or 'expired'?
            // Usually 'status' is 'sold' if there is a winner. If we remove winner, status should be 'expired' (unsold).
            product.status = 'expired';

            await product.save({ transaction: t });

            await t.commit();
            res.json({ message: 'Transaction cancelled successfully. Negative feedback sent to winner.' });
        } catch (error) {
            await t.rollback();
            console.error('Error cancelling transaction:', error);
            res.status(500).json({ message: 'Error cancelling transaction' });
        }
    },

    getBannedBidders: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const product = await Products.findByPk(id);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            if (product.seller_id !== userId) {
                return res.status(403).json({ message: 'Unauthorized' });
            }

            const bannedBidders = await BannedBidders.findAll({
                where: { product_id: id },
                include: [{
                    model: db.Users,
                    as: 'user', // Ensure association matches alias in index.js/models
                    attributes: ['id', 'name', 'email']
                }]
            });

            res.json(bannedBidders);
        } catch (error) {
            console.error('Error fetching banned bidders:', error);
            res.status(500).json({ message: 'Error fetching banned bidders' });
        }
    },

    unbanBidder: async (req, res) => {
        try {
            const { id, userId } = req.params;
            const sellerId = req.user.id;

            const product = await Products.findByPk(id);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            if (product.seller_id !== sellerId) {
                return res.status(403).json({ message: 'Unauthorized' });
            }

            const deleted = await BannedBidders.destroy({
                where: {
                    product_id: id,
                    user_id: userId
                }
            });

            if (deleted) {
                res.json({ message: 'User unbanned successfully' });
            } else {
                res.status(404).json({ message: 'Banned record not found' });
            }
        } catch (error) {
            console.error('Error unbanning bidder:', error);
            res.status(500).json({ message: 'Error unbanning bidder' });
        }
    }
};
