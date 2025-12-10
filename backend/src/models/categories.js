export default (sequelize, DataTypes) => {
    const Categories = sequelize.define('Categories', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        parent_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Categories',
                key: 'id'
            }
        }
    });

    Categories.associate = (models) => {
        Categories.hasMany(models.Categories, {
            foreignKey: 'parent_id',
            as: 'subcategories'
        });
        Categories.hasMany(models.Products, {
            foreignKey: 'category_id',
            as: 'products'
        });
    }

    return Categories;
}