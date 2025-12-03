import db from '../../models/index.js';
const { Products, ProductsImage } = db;

const seedProducts = async () => {
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
                image_url: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=800&q=80'
            },
            {
                name: '1967 Ford Mustang Shelby GT500',
                description: 'Fully restored classic muscle car.',
                starting_price: 150000,
                current_price: 165000,
                end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                image_url: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=800&q=80'
            },
            {
                name: 'Abstract Oil Painting',
                description: 'Original artwork by a renowned contemporary artist.',
                starting_price: 2000,
                current_price: 2000,
                end_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                image_url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=800&q=80'
            },
            {
                name: 'Antique Diamond Ring',
                description: '1.5 carat diamond set in platinum.',
                starting_price: 8000,
                current_price: 8200,
                end_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                image_url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80'
            },
            {
                name: 'Rare First Edition Book',
                description: 'A pristine copy of a literary classic.',
                starting_price: 1500,
                current_price: 1800,
                end_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                image_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80'
            },
            {
                name: 'Luxury Leather Handbag',
                description: 'Handcrafted Italian leather bag.',
                starting_price: 1200,
                current_price: 1200,
                end_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                image_url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80'
            },
            {
                name: 'Gaming Laptop',
                description: 'High-performance laptop for gaming and work.',
                starting_price: 2500,
                current_price: 2600,
                end_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
                image_url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80'
            }
        ];

        for (const prod of dummyProducts) {
            const product = await Products.create({
                name: prod.name,
                description: prod.description,
                starting_price: prod.starting_price,
                current_price: prod.current_price,
                end_date: prod.end_date,
                seller_id: 1, // Assuming user with ID 1 exists (admin/seeder user)
                category_id: 1, // Default category
                status: 'active',
                buy_now_price: prod.current_price * 1.5,
                step_price: 100
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
        return true;
    } catch (error) {
        console.error('Error seeding products:', error);
        throw error;
    }
};

export default seedProducts;
