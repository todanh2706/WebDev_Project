export default (sequelize, DataTypes) => {
    const Category = sequelize.define('Category', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    Category.associate = (models) => {
        Category.hasMany(models.Subcategory, {
            foreignKey: 'categoryId',
            as: 'subcategories'
        });
    }

    return Category;
}