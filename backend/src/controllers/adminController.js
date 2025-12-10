import db from '../models/index.js';

const { Users, UpgradeRequests, Products, ProductsImage, Bid } = db;

export default {
    getUsers: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 12;
            const offset = (page - 1) * limit;

            const users = await Users.findAndCountAll({
                attributes: { exclude: ['password'] },
                limit: limit,
                offset: offset,
                order: [['createdAt', 'DESC']]
            });

            res.json({
                totalItems: users.count,
                totalPages: Math.ceil(users.count / limit),
                currentPage: page,
                users: users.rows
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching users' });
        }
    },

    deleteUser: async (req, res) => {
        try {
            const { id } = req.params;
            const user = await Users.findByPk(id);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Prevent deleting self
            if (user.id === req.user.id) {
                return res.status(400).json({ message: 'Cannot delete yourself' });
            }

            await user.destroy();
            res.json({ message: 'User deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error deleting user' });
        }
    },

    getUpgradeRequests: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 12;
            const offset = (page - 1) * limit;

            const requests = await UpgradeRequests.findAndCountAll({
                include: [{
                    model: Users,
                    as: 'user',
                    attributes: ['id', 'name', 'email', 'role']
                }],
                limit: limit,
                offset: offset,
                order: [['createdAt', 'DESC']]
            });

            res.json({
                totalItems: requests.count,
                totalPages: Math.ceil(requests.count / limit),
                currentPage: page,
                requests: requests.rows
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching upgrade requests' });
        }
    },

    approveUpgradeRequest: async (req, res) => {
        const t = await db.sequelize.transaction();
        try {
            const { requestId } = req.params;
            const request = await UpgradeRequests.findByPk(requestId, { transaction: t });

            if (!request) {
                await t.rollback();
                return res.status(404).json({ message: 'Request not found' });
            }

            if (request.status !== 'pending') {
                await t.rollback();
                return res.status(400).json({ message: 'Request already processed' });
            }

            // Check if expired (7 days)
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            if (new Date(request.createdAt) < sevenDaysAgo) {
                await t.rollback();
                return res.status(400).json({ message: 'Request has expired (older than 7 days)' });
            }

            // Update request status
            request.status = 'approved';
            await request.save({ transaction: t });

            // Update user role
            const user = await Users.findByPk(request.user_id, { transaction: t });
            if (user) {
                user.role = 1;
                await user.save({ transaction: t });
            }

            await t.commit();
            res.json({ message: 'Request approved successfully' });
        } catch (error) {
            await t.rollback();
            console.error(error);
            res.status(500).json({ message: 'Error approving request' });
        }
    },

    rejectUpgradeRequest: async (req, res) => {
        try {
            const { requestId } = req.params;
            const request = await UpgradeRequests.findByPk(requestId);

            if (!request) {
                return res.status(404).json({ message: 'Request not found' });
            }

            if (request.status !== 'pending') {
                return res.status(400).json({ message: 'Request already processed' });
            }

            request.status = 'rejected';
            await request.save();

            res.json({ message: 'Request rejected successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error rejecting request' });
        }
    },

    deleteProduct: async (req, res) => {
        const t = await db.sequelize.transaction();
        try {
            const { id } = req.params;
            const product = await Products.findByPk(id);

            if (!product) {
                await t.rollback();
                return res.status(404).json({ message: 'Product not found' });
            }

            const { ProductsImage, Bid, Watchlist, BannedBidders, Feedbacks, ProductQuestions, BidPermissionRequest, Orders, Comment, ChatMessages } = db;

            if (Orders) {
                const orders = await Orders.findAll({ where: { product_id: id }, transaction: t });
                if (orders.length > 0) {
                    const orderIds = orders.map(o => o.order_id);
                    // Delete chat messages for these orders
                    if (ChatMessages) {
                        await ChatMessages.destroy({ where: { order_id: orderIds }, transaction: t });
                    }
                    // Delete the orders
                    await Orders.destroy({ where: { order_id: orderIds }, transaction: t });
                }
            }

            if (Comment) await Comment.destroy({ where: { product_id: id }, transaction: t });

            await ProductsImage.destroy({ where: { product_id: id }, transaction: t });
            await Bid.destroy({ where: { product_id: id }, transaction: t });
            if (Watchlist) await Watchlist.destroy({ where: { product_id: id }, transaction: t });
            if (BannedBidders) await BannedBidders.destroy({ where: { product_id: id }, transaction: t });
            if (Feedbacks) await Feedbacks.destroy({ where: { product_id: id }, transaction: t });
            if (ProductQuestions) await ProductQuestions.destroy({ where: { product_id: id }, transaction: t });
            if (BidPermissionRequest) await BidPermissionRequest.destroy({ where: { product_id: id }, transaction: t });

            await product.destroy({ transaction: t });
            await t.commit();
            res.json({ message: 'Product deleted successfully' });
        } catch (error) {
            await t.rollback();
            console.error(error);
            res.status(500).json({ message: 'Error deleting product' });
        }
    },

    getUserDetails: async (req, res) => {
        try {
            const { id } = req.params;
            const user = await Users.findByPk(id, {
                attributes: { exclude: ['password'] },
                include: [
                    {
                        model: Products,
                        as: 'products',
                        limit: 5,
                        order: [['createdAt', 'DESC']]
                    },
                    {
                        model: Bid,
                        as: 'bids',
                        include: [{
                            model: Products,
                            as: 'product',
                            attributes: ['id', 'name']
                        }],
                        limit: 5,
                        order: [['createdAt', 'DESC']]
                    },
                    {
                        model: Products,
                        as: 'current_wins',
                        limit: 5,
                        order: [['createdAt', 'DESC']]
                    },
                    {
                        model: db.Feedbacks,
                        as: 'target_user_reviews',
                        limit: 5,
                        order: [['createdAt', 'DESC']],
                        include: [{
                            model: Users,
                            as: 'reviewer',
                            attributes: ['id', 'name']
                        }]
                    }
                ]
            });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // We can also do a separate count if we want full stats
            const totalProducts = await Products.count({ where: { seller_id: id } });

            // To avoid complex include for ratings if association is tricky, we can simpler queries or just what we have.
            // Let's assume 'bids' and 'products' are safe.

            res.json({
                user,
                stats: {
                    totalProducts
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching user details' });
        }
    },

    updateUser: async (req, res) => {
        try {
            const { id } = req.params;
            const { role, status } = req.body;
            const user = await Users.findByPk(id);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Prevent updating self role/status to something locking
            if (user.id === req.user.id) {
                return res.status(400).json({ message: 'Cannot update your own sensitive fields' });
            }

            if (role !== undefined) user.role = role;
            if (status !== undefined) user.status = status;

            await user.save();
            res.json({ message: 'User updated successfully', user });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error updating user' });
        }
    }
};
