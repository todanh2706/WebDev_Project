'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const now = new Date();
        await queryInterface.bulkInsert('SystemSettings', [
            {
                key: 'auction_extension_minutes',
                value: '10',
                description: 'Duration to extend the auction by (in minutes).',
                createdAt: now,
                updatedAt: now
            },
            {
                key: 'auction_threshold_minutes',
                value: '5',
                description: 'Time threshold to trigger auto-extension (in minutes).',
                createdAt: now,
                updatedAt: now
            }
        ], {});
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('SystemSettings', null, {});
    }
};
