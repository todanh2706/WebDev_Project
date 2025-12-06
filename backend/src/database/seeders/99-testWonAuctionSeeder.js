import db from '../../models/index.js';
const { Products, ProductsImage, Bid, Users } = db;

export const up = async (queryInterface, Sequelize) => {
    try {
        const winnerId = 2;
        const winner = await Users.findByPk(winnerId);

        if (!winner) {
            console.log(`User with ID ${winnerId} not found. Skipping won auction seed.`);
            return;
        }

        // Create a product that is already sold to user 2
        const product = await Products.create({
            name: 'Test Won Auction Item',
            description: 'This is a test item that user 2 has won.',
            starting_price: 100,
            current_price: 150,
            end_date: new Date(Date.now() - 24 * 60 * 60 * 1000), // Ended 1 day ago
            seller_id: 1, // Assuming user 1 exists and is the seller
            category_id: 1, // Assuming category 1 exists
            status: 'sold',
            buy_now_price: 200,
            step_price: 10,
            current_winner_id: winnerId,
            post_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Posted 7 days ago
        });

        // Add an image
        await ProductsImage.create({
            product_id: product.id,
            image_url: 'https://placehold.co/600x400?text=Won+Item',
            is_thumbnail: true
        });

        // Add a winning bid
        await Bid.create({
            bidder_id: winnerId,
            product_id: product.id,
            amount: 150,
            max_bid_amount: 150,
            bid_time: new Date(Date.now() - 25 * 60 * 60 * 1000) // Bidded before end
        });

        console.log(`Successfully created won auction for user ${winnerId} (Product ID: ${product.id})`);

    } catch (error) {
        console.error('Error seeding won auction:', error);
        throw error;
    }
};

export const down = async (queryInterface, Sequelize) => {
    // Ideally we would delete the specific product, but for a test seeder we might just leave it or delete by name
    await queryInterface.bulkDelete('Products', { name: 'Test Won Auction Item' }, {});
};
