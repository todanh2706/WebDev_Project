import db from '../models/index.js';

const { Orders, ChatMessages, Products, Users, Feedbacks } = db;

export default {
    getOrderByProduct: async (req, res) => {
        try {
            const { productId } = req.params;
            const userId = req.user.id;

            // Find existing order
            let order = await Orders.findOne({
                where: { product_id: productId },
                include: [
                    { model: Users, as: 'winner', attributes: ['id', 'name', 'email'] },
                    { model: Users, as: 'seller', attributes: ['id', 'name', 'email'] },
                    { model: Products, as: 'product' }
                ]
            });

            if (!order) {
                // If no order, check if we should create one
                const product = await Products.findByPk(productId);
                if (!product) return res.status(404).json({ message: 'Product not found' });

                if (new Date(product.end_date) > new Date()) {
                    return res.status(400).json({ message: 'Auction is still active' });
                }

                if (!product.current_winner_id) {
                    return res.status(400).json({ message: 'Auction ended with no winner' });
                }

                // Create Order
                order = await Orders.create({
                    product_id: productId,
                    winner_id: product.current_winner_id,
                    seller_id: product.seller_id,
                    status: 'pending'
                });

                // Refetch to include associations
                order = await Orders.findByPk(order.order_id, {
                    include: [
                        { model: Users, as: 'winner', attributes: ['id', 'name', 'email'] },
                        { model: Users, as: 'seller', attributes: ['id', 'name', 'email'] },
                        { model: Products, as: 'product' }
                    ]
                });
            }

            // Authorization check
            if (order.winner_id !== userId && order.seller_id !== userId) {
                return res.status(403).json({ message: 'Unauthorized access to this order' });
            }

            const myFeedback = await Feedbacks.findOne({
                where: { product_id: productId, reviewer_id: userId }
            });

            res.json({ ...order.toJSON(), myFeedback });
        } catch (error) {

            console.error('Error fetching order:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    updateOrderStep: async (req, res) => {
        try {
            const { orderId } = req.params;
            const { status, shipping_address, payment_receipt, shipping_receipt } = req.body;
            const userId = req.user.id;

            const order = await Orders.findByPk(orderId);
            if (!order) return res.status(404).json({ message: 'Order not found' });

            // Authorization
            if (order.winner_id !== userId && order.seller_id !== userId) {
                return res.status(403).json({ message: 'Unauthorized' });
            }

            // State Transitions
            const updates = {};

            if (status === 'paid') {
                if (order.winner_id !== userId) return res.status(403).json({ message: 'Only winner can mark as paid' });
                if (!shipping_address) return res.status(400).json({ message: 'Shipping address is required' });
                // Payment receipt might be optional or required depending on logic, let's keep it optional for now or frontend validation
                updates.status = 'paid';
                updates.shipping_address = shipping_address;
                if (payment_receipt) updates.payment_receipt = payment_receipt;
            } else if (status === 'shipped') {
                if (order.seller_id !== userId) return res.status(403).json({ message: 'Only seller can mark as shipped' });
                updates.status = 'shipped';
                if (shipping_receipt) updates.shipping_receipt = shipping_receipt;
            } else if (status === 'completed') {
                if (order.winner_id !== userId) return res.status(403).json({ message: 'Only winner can confirm receipt' });
                updates.status = 'completed';
            } else if (status === 'cancelled') {
                if (order.seller_id !== userId) return res.status(403).json({ message: 'Only seller can cancel' });
                updates.status = 'cancelled';
            } else {
                return res.status(400).json({ message: 'Invalid status update' });
            }

            await order.update(updates);

            // Refetch to include associations
            const updatedOrder = await Orders.findByPk(orderId, {
                include: [
                    { model: Users, as: 'winner', attributes: ['id', 'name', 'email'] },
                    { model: Users, as: 'seller', attributes: ['id', 'name', 'email'] },
                    { model: Products, as: 'product' }
                ]
            });

            res.json(updatedOrder);

        } catch (error) {
            console.error('Error updating order:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getMessages: async (req, res) => {
        try {
            const { orderId } = req.params;
            const userId = req.user.id;

            const order = await Orders.findByPk(orderId);
            if (!order) return res.status(404).json({ message: 'Order not found' });

            if (order.winner_id !== userId && order.seller_id !== userId) {
                return res.status(403).json({ message: 'Unauthorized' });
            }

            const messages = await ChatMessages.findAll({
                where: { order_id: orderId },
                include: [
                    { model: Users, as: 'sender', attributes: ['id', 'name'] }
                ],
                order: [['send_at', 'ASC']]
            });

            res.json(messages);
        } catch (error) {
            console.error('Error fetching messages:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    sendMessage: async (req, res) => {
        try {
            const { orderId } = req.params;
            const { message } = req.body;
            const userId = req.user.id;

            const order = await Orders.findByPk(orderId);
            if (!order) return res.status(404).json({ message: 'Order not found' });

            if (order.winner_id !== userId && order.seller_id !== userId) {
                return res.status(403).json({ message: 'Unauthorized' });
            }

            const receiverId = userId === order.winner_id ? order.seller_id : order.winner_id;

            const newMessage = await ChatMessages.create({
                order_id: orderId,
                sender_id: userId,
                receiver_id: receiverId,
                message: message,
                send_at: new Date()
            });

            // Re-fetch to include sender info
            const fullMessage = await ChatMessages.findByPk(newMessage.message_id, {
                include: [
                    { model: Users, as: 'sender', attributes: ['id', 'name'] }
                ]
            });

            res.json(fullMessage);
        } catch (error) {
            console.error('Error sending message:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};
