import db from '../models/index.js';
import { sendCommentNotification } from '../services/emailService.js';

const Comment = db.Comment;
const User = db.Users;
const Product = db.Products;

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
                    // Check if commenter is not the seller
                    if (product.seller.id !== userId) {
                        const commenterName = req.user.name || 'A user'; // Assuming req.user has name from auth middleware
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
