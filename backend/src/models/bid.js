export default (sequelize, DataTypes) => {
    const Bid = sequelize.define('Bid', {
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        bidTime: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    });

    Bid.associate = (models) => {
        Bid.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user'
        });
        Bid.belongsTo(models.Product, {
            foreignKey: 'productId',
            as: 'product'
        });
    };

    return Bid;
};
