import db from '../../models/index.js';
const { Products, ProductsImage } = db;

export const up = async (queryInterface, Sequelize) => {
    try {
        const count = await Products.count();
        if (count > 0) {
            console.log('Products already seeded.');
            return;
        }

        const dummyProducts = [
            {
                name: 'Vintage Rolex Submariner',
                description: 'A classic diver watch from 1980s.',
                starting_price: 5000,
                current_price: 5500,
                end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                image_url: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=800&q=80',
                category_id: 16 // Men's Fashion
            },
            {
                name: '1967 Ford Mustang Shelby GT500',
                description: 'Fully restored classic muscle car.',
                starting_price: 150000,
                current_price: 165000,
                end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                image_url: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=800&q=80',
                category_id: 15 // Decor (closest fit or maybe create a Vehicles category?)
            },
            {
                name: 'Abstract Oil Painting',
                description: 'Original artwork by a renowned contemporary artist.',
                starting_price: 2000,
                current_price: 2000,
                end_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                image_url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=800&q=80',
                category_id: 15 // Decor
            },
            {
                name: 'Antique Diamond Ring',
                description: '1.5 carat diamond set in platinum.',
                starting_price: 8000,
                current_price: 8200,
                end_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                image_url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
                category_id: 17 // Women's Fashion
            },
            {
                name: 'Rare First Edition Book',
                description: 'A pristine copy of a literary classic.',
                starting_price: 1500,
                current_price: 1800,
                end_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                image_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80',
                category_id: 15 // Decor
            },
            {
                name: 'Luxury Leather Handbag',
                description: 'Handcrafted Italian leather bag.',
                starting_price: 1200,
                current_price: 1200,
                end_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                image_url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
                category_id: 17 // Women's Fashion
            },
            {
                name: 'Gaming Laptop',
                description: 'High-performance laptop for gaming and work.',
                starting_price: 2500,
                current_price: 2600,
                end_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
                image_url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80',
                category_id: 10 // Laptops
            }
        ];

        // Generate more products to reach 50
        const adjectives = ['Vintage', 'Modern', 'Antique', 'Rare', 'Limited Edition', 'Custom', 'Handmade', 'Premium', 'Exclusive', 'Classic'];
        const nouns = ['Watch', 'Camera', 'Laptop', 'Chair', 'Table', 'Painting', 'Sculpture', 'Guitar', 'Sneakers', 'Headphones', 'Phone', 'Console'];
        const descriptions = [
            'Excellent condition, barely used.',
            'Brand new in box with warranty.',
            'A unique piece for collectors.',
            'High quality craftsmanship.',
            'Perfect for your home or office.',
            'Restored to its original glory.',
            'Includes all original accessories.'
        ];

        const categories = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]; // Subcategory IDs
        const images = [
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1593642632823-8f78536788c6?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1588872657578-184165b93baf?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=800&q=80'
        ];

        for (let i = dummyProducts.length; i < 50; i++) {
            const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
            const noun = nouns[Math.floor(Math.random() * nouns.length)];
            const startPrice = Math.floor(Math.random() * 5000) + 100;

            dummyProducts.push({
                name: `${adj} ${noun}`,
                description: descriptions[Math.floor(Math.random() * descriptions.length)],
                starting_price: startPrice,
                current_price: startPrice,
                end_date: new Date(Date.now() + Math.floor(Math.random() * 14 + 1) * 24 * 60 * 60 * 1000),
                image_url: images[Math.floor(Math.random() * images.length)],
                category_id: categories[Math.floor(Math.random() * categories.length)]
            });
        }

        for (const prod of dummyProducts) {
            const product = await Products.create({
                name: prod.name,
                description: prod.description,
                starting_price: prod.starting_price,
                current_price: prod.current_price,
                end_date: prod.end_date,
                seller_id: 1, // Assuming user with ID 1 exists
                category_id: prod.category_id || 1,
                status: 'active',
                buy_now_price: prod.current_price * 1.5,
                step_price: Math.max(10, Math.floor(prod.current_price * 0.05))
            });

            if (prod.image_url) {
                await ProductsImage.create({
                    product_id: product.id,
                    image_url: prod.image_url,
                    is_thumbnail: true
                });
            }
        }

        console.log('Products seeded successfully');
    } catch (error) {
        console.error('Error seeding products:', error);
        throw error;
    }
};

export const down = async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Products', null, {});
    await queryInterface.bulkDelete('ProductsImages', null, {});
};
