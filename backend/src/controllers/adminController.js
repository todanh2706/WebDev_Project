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
        try {
            const { id } = req.params;
            const product = await Products.findByPk(id);

            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            await product.destroy();
            res.json({ message: 'Product deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error deleting product' });
        }
    }
};
