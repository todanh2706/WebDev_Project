export default (sequelize, DataTypes) => {
    const Products = sequelize.define('Products', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        seller_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Categories',
                key: 'id'
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        starting_price: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false
        },
        current_price: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false
        },
        step_price: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0
        },
        buy_now_price: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false
        },
        post_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        end_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        is_auto_extend: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        status: {
            type: DataTypes.ENUM('active', 'sold', 'expired'),
            defaultValue: 'active'
        },
        current_winner_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        full_text_search: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });

    Products.associate = (models) => {
        Products.belongsTo(models.Users, {
            foreignKey: 'seller_id',
            as: 'seller'
        });
        Products.belongsTo(models.Categories, {
            foreignKey: 'category_id',
            as: 'category'
        });
        Products.belongsTo(models.Users, {
            foreignKey: 'current_winner_id',
            as: 'current_winner'
        });
        Products.hasMany(models.ProductsImage, {
            foreignKey: 'product_id',
            as: 'images'
        });
        Products.hasMany(models.Bid, {
            foreignKey: 'product_id',
            as: 'bids'
        });
        Products.hasMany(models.Watchlist, {
            foreignKey: 'product_id',
            as: 'watchlist'
        });
        Products.hasMany(models.BannedBidders, {
            foreignKey: 'product_id',
            as: 'banned_bidders'
        });
        Products.hasMany(models.Feedbacks, {
            foreignKey: 'product_id',
            as: 'feedbacks'
        });
        Products.hasMany(models.ProductQuestions, {
            foreignKey: 'product_id',
            as: 'questions'
        });
    }

    return Products;
};
