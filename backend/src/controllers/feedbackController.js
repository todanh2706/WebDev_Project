import db from '../models/index.js';

const { Feedbacks, Products, Bid, Users } = db;

export default {
    create: async (req, res) => {
        try {
            const { product_id, rating, comment } = req.body;
            const reviewer_id = req.user.id;

            // Validate input
            if (!product_id || !rating || !comment) {
                return res.status(400).json({ message: 'Product ID, rating, and comment are required.' });
            }

            if (!['good', 'bad'].includes(rating)) {
                return res.status(400).json({ message: 'Rating must be either "good" or "bad".' });
            }

            // Fetch product
            const product = await Products.findByPk(product_id);
            if (!product) {
                return res.status(404).json({ message: 'Product not found.' });
            }

            // Check if product is expired or sold
            const now = new Date();
            const isExpired = new Date(product.end_date) < now;
            const isSold = product.status === 'sold';

            if (!isExpired && !isSold) {
                return res.status(400).json({ message: 'You can only assess sellers after the auction has ended.' });
            }

            // Verify Winner
            let winnerId = product.current_winner_id;

            // Fallback: If current_winner_id is not set, check the highest bid
            if (!winnerId) {
                const highestBid = await Bid.findOne({
                    where: { product_id },
                    order: [['amount', 'DESC']],
                });
                if (highestBid) {
                    winnerId = highestBid.bidder_id;
                }
            }

            // Verify Permission:
            // 1. Winner can rate Seller.
            // 2. Seller can rate Winner.

            let isAllowed = false;
            let targetUserId = null;

            if (winnerId === reviewer_id) {
                // Winner rating Seller
                isAllowed = true;
                targetUserId = product.seller_id;
            } else if (product.seller_id === reviewer_id) {
                // Seller rating Winner
                if (!winnerId) {
                    return res.status(400).json({ message: 'No winner to rate.' });
                }
                isAllowed = true;
                targetUserId = winnerId;
            }

            if (!isAllowed) {
                return res.status(403).json({ message: 'You are not authorized to leave feedback for this transaction.' });
            }

            // Check if feedback already exists
            const existingFeedback = await Feedbacks.findOne({
                where: {
                    product_id,
                    reviewer_id
                }
            });

            if (existingFeedback) {
                return res.status(400).json({ message: 'You have already submitted feedback for this product.' });
            }

            // Create Feedback
            const feedback = await Feedbacks.create({
                product_id,
                reviewer_id,
                target_user_id: targetUserId,
                rating,
                comment
            });

            res.status(201).json({ message: 'Feedback submitted successfully.', feedback });

        } catch (error) {
            console.error('Error creating feedback:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    },

    update: async (req, res) => {
        try {
            const { feedbackId } = req.params;
            const { rating, comment } = req.body;
            const userId = req.user.id;

            const feedback = await Feedbacks.findByPk(feedbackId);
            if (!feedback) {
                return res.status(404).json({ message: 'Feedback not found.' });
            }

            if (feedback.reviewer_id !== userId) {
                return res.status(403).json({ message: 'Unauthorized to edit this feedback.' });
            }

            if (!['good', 'bad'].includes(rating)) {
                return res.status(400).json({ message: 'Rating must be either "good" or "bad".' });
            }

            await feedback.update({ rating, comment });
            res.json({ message: 'Feedback updated successfully.', feedback });

        } catch (error) {
            console.error('Error updating feedback:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    }

};
