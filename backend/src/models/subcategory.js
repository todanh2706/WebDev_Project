export default (sequelize, DataTypes) => {
    const Subcategory = sequelize.define('Subcategory', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    Subcategory.associate = (models) => {
        Subcategory.belongsTo(models.Category, {
            foreignKey: 'categoryId',
            as: 'category'
        });
    };

    return Subcategory;
}