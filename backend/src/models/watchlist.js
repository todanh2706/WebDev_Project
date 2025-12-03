export default (sequelize, DataTypes) => {
    const Watchlist = sequelize.define('Watchlist', {
        product_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'Products',
                key: 'id'
            }
        },
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        added_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    });

    Watchlist.associate = (models) => {
        Watchlist.belongsTo(models.Products, {
            foreignKey: 'product_id',
            as: 'product'
        });
        Watchlist.belongsTo(models.Users, {
            foreignKey: 'user_id',
            as: 'user'
        });
    };

    return Watchlist;
}