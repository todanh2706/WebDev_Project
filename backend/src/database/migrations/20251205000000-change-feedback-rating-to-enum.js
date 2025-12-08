'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {

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
