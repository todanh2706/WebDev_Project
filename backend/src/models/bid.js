export default (sequelize, DataTypes) => {
    const Bid = sequelize.define('Bid', {
        bid_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        bidder_id: {
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
        amount: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false
        },
        bid_time: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        max_bid_amount: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false
        }
    });

    Bid.associate = (models) => {
        Bid.belongsTo(models.Users, {
            foreignKey: 'bidder_id',
            as: 'bidder'
        });
        Bid.belongsTo(models.Products, {
            foreignKey: 'product_id',
            as: 'product'
        });
    };

    return Bid;
};
