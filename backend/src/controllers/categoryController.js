import db from '../models/index.js';

const Category = db.Category;
const Subcategory = db.Subcategory;

export default {
    getAll: async (req, res) => {
        try {
            const categories = await Category.findAll({
                include: [{
                    model: Subcategory,
                    as: 'subcategories',
                    attributes: ['id', 'name']
                }],
                attributes: ['id', 'name']
            });
            res.json(categories);
        } catch (error) {
            console.error("Error fetching categories:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
};
