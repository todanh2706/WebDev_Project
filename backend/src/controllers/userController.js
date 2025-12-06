import db from '../models/index.js';
import bcrypt from 'bcrypt';

const { Users, Products, Bid, Watchlist, Feedbacks, ProductsImage } = db;

export default {
    getProfile: async (req, res) => {
        try {
            const user = await Users.findByPk(req.user.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching profile' });
        }
    },

    updateProfile: async (req, res) => {
        try {
            const { name, email, oldPassword, newPassword } = req.body;
            const user = await Users.findByPk(req.user.id);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Update basic info
            if (name) user.name = name;
            if (email) user.email = email;

            // Update password if provided
            if (newPassword) {
                if (!oldPassword) {
                    return res.status(400).json({ message: 'Old password is required to set a new password' });
                }
                const isMatch = await bcrypt.compare(oldPassword, user.password);
                if (!isMatch) {
                    return res.status(400).json({ message: 'Incorrect old password' });
                }
                // Password hashing is handled by beforeUpdate hook in Users model
                user.password = newPassword;
            }

            await user.save();
            res.json({ message: 'Profile updated successfully', user });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error updating profile' });
        }
    },

    getWatchlist: async (req, res) => {
        try {
            const watchlist = await Watchlist.findAll({
                where: { user_id: req.user.id },
                include: [{
                    model: Products,
                    as: 'product',
                    include: [{
                        model: ProductsImage,
                        as: 'images',
                        where: { is_thumbnail: true },
                        required: false
                    }, {
                        model: Users,
                        as: 'current_winner',
                        attributes: ['name']
                    }]
                }]
            });

            // Format to match ProductCard expectation
            const products = watchlist.map(item => item.product);
            res.json(products);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching watchlist' });
        }
    },

    getParticipatingAuctions: async (req, res) => {
        try {
            // Find all distinct products where user has bid
            const bids = await Bid.findAll({
                where: { bidder_id: req.user.id },
                attributes: ['product_id'],
                group: ['product_id']
            });

            const productIds = bids.map(bid => bid.product_id);

            const products = await Products.findAll({
                where: { id: productIds },
                include: [{
                    model: ProductsImage,
                    as: 'images',
                    where: { is_thumbnail: true },
                    required: false
                }, {
                    model: Users,
                    as: 'current_winner',
                    attributes: ['name']
                }]
            });

            res.json(products);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching participating auctions' });
        }
    },

    getWonAuctions: async (req, res) => {
        try {
            const products = await Products.findAll({
                where: {
                    current_winner_id: req.user.id,
                    status: 'sold' // Assuming 'sold' status implies auction ended
                },
                include: [{
                    model: ProductsImage,
                    as: 'images',
                    where: { is_thumbnail: true },
                    required: false
                }, {
                    model: Users,
                    as: 'current_winner',
                    attributes: ['name']
                }, {
                    model: Feedbacks,
                    as: 'feedbacks',
                    where: { reviewer_id: req.user.id },
                    required: false
                }]
            });
            res.json(products);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching won auctions' });
        }
    },

    getRatings: async (req, res) => {
        try {
            const feedbacks = await Feedbacks.findAll({
                where: { target_user_id: req.user.id },
                include: [{
                    model: Users,
                    as: 'reviewer',
                    attributes: ['name']
                }, {
                    model: Products,
                    as: 'product',
                    attributes: ['name']
                }]
            });
            res.json(feedbacks);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching ratings' });
        }
    },

    addToWatchlist: async (req, res) => {
        try {
            const { productId } = req.body;
            const userId = req.user.id;

            if (!productId) {
                return res.status(400).json({ message: 'Product ID is required' });
            }

            // Check if product exists
            const product = await Products.findByPk(productId);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            // Check if already in watchlist
            const existing = await Watchlist.findOne({
                where: {
                    user_id: userId,
                    product_id: productId
                }
            });

            if (existing) {
                return res.status(400).json({ message: 'Product already in watchlist' });
            }

            await Watchlist.create({
                user_id: userId,
                product_id: productId
            });

            res.status(201).json({ message: 'Added to watchlist' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error adding to watchlist' });
        }
    },

    removeFromWatchlist: async (req, res) => {
        try {
            const { productId } = req.params;
            const userId = req.user.id;

            const deleted = await Watchlist.destroy({
                where: {
                    user_id: userId,
                    product_id: productId
                }
            });

            if (!deleted) {
                return res.status(404).json({ message: 'Item not found in watchlist' });
            }

            res.json({ message: 'Removed from watchlist' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error removing from watchlist' });
        }
    }
};
