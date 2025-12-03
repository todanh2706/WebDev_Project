export default (sequelize, DataTypes) => {
    const Orders = sequelize.define('Orders', {
        order_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        winner_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        seller_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Products',
                key: 'id'
            }
        },
        status: {
            type: DataTypes.ENUM('pending', 'paid', 'shipped', 'completed', 'cancelled'),
            defaultValue: 'pending'
        }
    });

    Orders.associate = (models) => {
        Orders.belongsTo(models.Users, {
            foreignKey: 'winner_id',
            as: 'winner'
        });
        Orders.belongsTo(models.Users, {
            foreignKey: 'seller_id',
            as: 'seller'
        });
        Orders.belongsTo(models.Products, {
            foreignKey: 'product_id',
            as: 'product'
        });
        Orders.hasMany(models.ChatMessages, {
            foreignKey: 'order_id',
            as: 'messages'
        });
    };

    return Orders;
}