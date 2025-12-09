'use strict';

export default {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Comments', 'parent_id', {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'Comments',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Comments', 'parent_id');
    }
};
