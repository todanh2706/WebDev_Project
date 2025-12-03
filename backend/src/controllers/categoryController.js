import db from '../models/index.js';

const Categories = db.Categories;

export default {
    getAll: async (req, res) => {
        try {
            const categories = await Categories.findAll({
                where: { parent_id: null },
                include: [{
                    model: Categories,
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
