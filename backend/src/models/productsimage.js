export default (sequelize, DataTypes) => {
    const ProductsImage = sequelize.define('ProductsImage', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Products',
                key: 'id'
            }
        },
        image_url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        is_thumbnail: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    });

    ProductsImage.associate = (models) => {
        ProductsImage.belongsTo(models.Products, {
            foreignKey: 'product_id',
            as: 'product'
        })
    }

    return ProductsImage;
}