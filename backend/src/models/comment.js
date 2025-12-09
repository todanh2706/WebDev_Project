export default (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', {
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
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        parent_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Comments',
                key: 'id'
            }
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    });

    Comment.associate = (models) => {
        Comment.belongsTo(models.Users, {
            foreignKey: 'user_id',
            as: 'user'
        });
        Comment.belongsTo(models.Products, {
            foreignKey: 'product_id',
            as: 'product'
        });
        Comment.hasMany(models.Comment, {
            foreignKey: 'parent_id',
            as: 'replies'
        });
        Comment.belongsTo(models.Comment, {
            foreignKey: 'parent_id',
            as: 'parent'
        });
    };

    return Comment;
};
