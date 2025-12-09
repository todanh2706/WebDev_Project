import db from '../models/index.js';

const Comment = db.Comment;
const User = db.Users;

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
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error adding comment' });
        }
    }
};
