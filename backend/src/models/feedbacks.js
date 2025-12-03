export default (sequelize, DataTypes) => {
    const Feedbacks = sequelize.define('Feedbacks', {
        feedback_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        reviewer_id: {
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
        target_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    Feedbacks.associate = (models) => {
        Feedbacks.belongsTo(models.Users, {
            foreignKey: 'reviewer_id',
            as: 'reviewer'
        });
        Feedbacks.belongsTo(models.Users, {
            foreignKey: 'target_user_id',
            as: 'target_user'
        });
        Feedbacks.belongsTo(models.Products, {
            foreignKey: 'product_id',
            as: 'product'
        });
    };

    return Feedbacks;
}