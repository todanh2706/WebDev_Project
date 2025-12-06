import db from '../../models/index.js';

const { Watchlist, Users, Products } = db;

export const up = async (queryInterface, Sequelize) => {
    try {
        // Check if watchlist already has data
        const count = await Watchlist.count();
        if (count > 0) {
            console.log('Watchlist already seeded.');
            return;
        }

        // Get a user (e.g., the first user found)
        const user = await Users.findOne();
        if (!user) {
            console.log('No users found. Skipping watchlist seeding.');
            return;
        }

        // Get some products
        const products = await Products.findAll({ limit: 5 });
        if (products.length === 0) {
            console.log('No products found. Skipping watchlist seeding.');
            return;
        }

        const watchlistData = products.map(product => ({
            user_id: user.id,
            product_id: product.id,
            added_date: new Date()
        }));

        await Watchlist.bulkCreate(watchlistData);
        console.log(`Added ${watchlistData.length} items to watchlist for user ${user.email}`);

    } catch (error) {
        console.error('Error seeding watchlist:', error);
    }
};

export const down = async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Watchlists', null, {});
};
