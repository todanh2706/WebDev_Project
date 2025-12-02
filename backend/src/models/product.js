export default (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        startingPrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        currentPrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: true
        },
        endTime: {
            type: DataTypes.DATE,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('active', 'closed'),
            defaultValue: 'active'
        }
    });

    Product.associate = (models) => {
        Product.hasMany(models.Bid, {
            foreignKey: 'productId',
            as: 'bids'
        });
    };

    return Product;
};
