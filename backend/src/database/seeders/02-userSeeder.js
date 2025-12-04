import db from '../../models/index.js';
import bcrypt from 'bcrypt';

const { Users } = db;

export const up = async (queryInterface, Sequelize) => {
    try {
        const count = await Users.count();
        if (count > 0) {
            console.log('Users already seeded.');
            return;
        }

        const hashedPassword = await bcrypt.hash('password123', 10);

        await Users.create({
            id: 1, // Force ID 1
            name: 'Admin User',
            email: 'admin@example.com',
            password: hashedPassword,
            phone: '1234567890',
            address: '123 Admin St',
            role: 2, // 2: admin
            status: 'active',
            is_verified: true
        });

        console.log('User seeded successfully.');

        // Reset the ID sequence to avoid unique constraint errors
        await queryInterface.sequelize.query(`SELECT setval('"Users_id_seq"', (SELECT MAX(id) FROM "Users"))`);
    } catch (error) {
        console.error('Error seeding users:', error);
    }
};

export const down = async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
};
