'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // First, we need to drop the old column or alter it. 
        // Since it's integer and we want enum/string, and table is empty, we can drop and recreate or alter with type cast.
        // Given table is empty, dropping and adding is safe and clean for type change.

        await queryInterface.removeColumn('Feedbacks', 'rating');

        await queryInterface.addColumn('Feedbacks', 'rating', {
            type: Sequelize.ENUM('good', 'bad'),
            allowNull: false
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Feedbacks', 'rating');

        await queryInterface.addColumn('Feedbacks', 'rating', {
            type: Sequelize.INTEGER,
            allowNull: false
        });

        // Drop the enum type created by postgres
        await queryInterface.sequelize.query('DROP TYPE "enum_Feedbacks_rating";');
    }
};
