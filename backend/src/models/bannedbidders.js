export default (sequelize, DataTypes) => {
    const BannedBidders = sequelize.define('BannedBidders', {

        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        product_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'Products',
                key: 'id'
            }
        }
    });

    BannedBidders.associate = (models) => {
        BannedBidders.belongsTo(models.Users, {
            foreignKey: 'user_id',
            as: 'user'
        });
        BannedBidders.belongsTo(models.Products, {
            foreignKey: 'product_id',
            as: 'product'
        });
    };

    return BannedBidders;
}