'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.changeColumn('Products', 'buy_now_price', {
            type: Sequelize.DECIMAL(15, 2),
            allowNull: true
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query('UPDATE "Products" SET "buy_now_price" = 0 WHERE "buy_now_price" IS NULL');

        await queryInterface.changeColumn('Products', 'buy_now_price', {
            type: Sequelize.DECIMAL(15, 2),
            allowNull: false
        });
    }
};
