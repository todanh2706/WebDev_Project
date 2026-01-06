import db from '../models/index.js';
import { sendCommentNotification, sendReplyNotification } from '../services/emailService.js';

const Comment = db.Comment;
const User = db.Users;
const Product = db.Products;
const Bid = db.Bid;

export default {
    getComments: async (req, res) => {
        try {
            const { id } = req.params;
            const comments = await Comment.findAll({
                where: { product_id: id },
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'name']
                    }
                ],
                order: [['createdAt', 'ASC']]
            });
            res.json(comments);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching comments' });
        }
    },

    addComment: async (req, res) => {
        try {
            const { id } = req.params;
            const { content, parent_id } = req.body;
            const userId = req.user.id;

            if (!content || !content.trim()) {
                return res.status(400).json({ message: 'Comment content is required' });
            }

            const comment = await Comment.create({
                product_id: id,
                user_id: userId,
                content: content.trim(),
                parent_id: parent_id || null
            });

            // Fetch the created comment with user details to return to frontend
            const createdComment = await Comment.findOne({
                where: { id: comment.id },
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'name']
                    }
                ]
            });

            res.status(201).json(createdComment);

            // Send email notification to seller
            try {
                // Fetch product with seller info
                const product = await Product.findByPk(id, {
                    include: [
                        {
                            model: User,
                            as: 'seller',
                            attributes: ['id', 'email', 'name']
                        }
                    ]
                });

                if (product && product.seller) {
                    // Check if commenter is the seller (Reply Scenario)
                    if (product.seller.id === userId) {
                        // Seller is replying. Notify all interested users (bidders + commenters)
                        const interestedUsers = new Set();

                        // 1. Get Bidders
                        const bidders = await Bid.findAll({
                            where: { product_id: id },
                            include: [{ model: User, as: 'bidder', attributes: ['email'] }]
                        });
                        bidders.forEach(b => {
                            if (b.bidder && b.bidder.email) interestedUsers.add(b.bidder.email);
                        });

                        // 2. Get Commenters
                        const commenters = await Comment.findAll({
                            where: { product_id: id },
                            include: [{ model: User, as: 'user', attributes: ['email'] }]
                        });
                        commenters.forEach(c => {
                            if (c.user && c.user.email) interestedUsers.add(c.user.email);
                        });

                        // Remove seller's own email if present (though checking userId vs sellerId handles source, 
                        // but if seller bid on own product impossible, but assuming safe set ops)
                        if (interestedUsers.has(product.seller.email)) {
                            interestedUsers.delete(product.seller.email);
                        }

                        // Send Emails
                        for (const email of interestedUsers) {
                            await sendReplyNotification(email, product.name, content.trim());
                        }

                    } else {
                        // Regular user commenting. Notify Seller.
                        const commenterName = req.user.name || 'A user';
                        await sendCommentNotification(
                            product.seller.email,
                            product.seller.name,
                            commenterName,
                            product.name,
                            content.trim()
                        );
                    }
                }
            } catch (emailError) {
                // Don't block response if email fails
                console.error('Failed to process email notification:', emailError);
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error adding comment' });
        }
    }
};
