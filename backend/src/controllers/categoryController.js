import db from '../models/index.js';

const Categories = db.Categories;
const Products = db.Products;

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
    },

    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const category = await Categories.findByPk(id, {
                include: [
                    {
                        model: Categories,
                        as: 'subcategories',
                        attributes: ['id', 'name']
                    },
                    {
                        model: Products,
                        as: 'products',
                        limit: 10, // Limit for preview, maybe add pagination later if needed
                        order: [['createdAt', 'DESC']],
                        attributes: ['id', 'name', 'current_price', 'end_date', 'status'],
                        include: [{
                            model: db.ProductsImage,
                            as: 'images',
                            where: { is_thumbnail: true },
                            required: false,
                            attributes: ['image_url']
                        }]
                    }
                ]
            });
            if (!category) {
                return res.status(404).json({ message: "Category not found" });
            }
            res.json(category);
        } catch (error) {
            console.error("Error fetching category:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { name } = req.body;
            const category = await Categories.findByPk(id);

            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }

            category.name = name;
            await category.save();
            res.json({ message: 'Category updated successfully', category });
        } catch (error) {
            console.error("Error updating category:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const category = await Categories.findByPk(id);

            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }
            await category.destroy();
            res.json({ message: 'Category deleted successfully' });
        } catch (error) {
            console.error("Error deleting category:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
};
