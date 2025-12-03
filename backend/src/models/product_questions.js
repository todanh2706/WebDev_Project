export default (sequelize, DataTypes) => {
    const ProductQuestions = sequelize.define('ProductQuestions', {
        question_id: {
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
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        question: {
            type: DataTypes.STRING,
            allowNull: false
        },
        answer: {
            type: DataTypes.STRING,
            allowNull: true
        },
        asked_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        answer_at: {
            type: DataTypes.DATE,
            allowNull: true
        }
    });

    ProductQuestions.associate = (models) => {
        ProductQuestions.belongsTo(models.Products, {
            foreignKey: 'product_id',
            as: 'product'
        });
        ProductQuestions.belongsTo(models.Users, {
            foreignKey: 'user_id',
            as: 'user'
        });
    };

    return ProductQuestions;
}