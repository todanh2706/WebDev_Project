import db from '../../models/index.js';

const Categories = db.Categories;

const categoriesData = [
    {
        name: 'Electronics',
        subcategories: [
            'Phones & Tablets',
            'Computers',
            'Audio'
        ]
    },
    {
        name: 'Laptops & PC',
        subcategories: [
            'Laptops',
            'Components'
        ]
    },
    {
        name: 'Cameras & Photo',
        subcategories: [
            'Cameras',
            'Lenses'
        ]
    },
    {
        name: 'Home & Garden',
        subcategories: [
            'Furniture',
            'Decor'
        ]
    },
    {
        name: 'Fashion',
        subcategories: [
            'Men',
            'Women'
        ]
    },
    {
        name: 'Gaming',
        subcategories: [
            'Consoles',
            'Video Games'
        ]
    }
];

export const seedCategories = async () => {
    try {
        const count = await Categories.count();
        if (count > 0) {
            console.log('Categories already seeded.');
            return;
        }

        console.log('Seeding categories...');

        for (const catData of categoriesData) {
            const category = await Categories.create({ name: catData.name });

            for (const subName of catData.subcategories) {
                await Categories.create({
                    name: subName,
                    parent_id: category.id
                });
            }
        }

        console.log('Categories seeded successfully.');
    } catch (error) {
        console.error('Error seeding categories:', error);
    }
};
