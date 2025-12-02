import db from '../../models/index.js';
const { Product } = db;

const seedProducts = async () => {
    try {
        const dummyProducts = [
            {
                name: 'Vintage Rolex Submariner',
                description: 'A classic diver watch from 1980s.',
                startingPrice: 5000,
                currentPrice: 5500,
                imageUrl: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=800&q=80',
                endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            },
            {
                name: '1967 Ford Mustang Shelby GT500',
                description: 'Fully restored classic muscle car.',
                startingPrice: 150000,
                currentPrice: 165000,
                imageUrl: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=800&q=80',
                endTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
            },
            {
                name: 'Abstract Oil Painting',
                description: 'Original artwork by a renowned contemporary artist.',
                startingPrice: 2000,
                currentPrice: 2000,
                imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=800&q=80',
                endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
            },
            {
                name: 'Antique Diamond Ring',
                description: '1.5 carat diamond set in platinum.',
                startingPrice: 8000,
                currentPrice: 8200,
                imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
                endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
            },
            {
                name: 'Rare First Edition Book',
                description: 'A pristine copy of a literary classic.',
                startingPrice: 1500,
                currentPrice: 1800,
                imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80',
                endTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
            },
            {
                name: 'Luxury Leather Handbag',
                description: 'Handcrafted Italian leather bag.',
                startingPrice: 1200,
                currentPrice: 1200,
                imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
                endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
            },
            {
                name: 'Gaming Laptop',
                description: 'High-performance laptop for gaming and work.',
                startingPrice: 2500,
                currentPrice: 2600,
                imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80',
                endTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)
            }
        ];

        await Product.bulkCreate(dummyProducts);
        console.log('Products seeded successfully');
        return true;
    } catch (error) {
        console.error('Error seeding products:', error);
        throw error;
    }
};

export default seedProducts;
