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
            type: DataTypes.TSVECTOR,
            allowNull: true
        }
    }, {
        hooks: {
            beforeSave: async (product, options) => {
                if (product.changed('name') || product.changed('category_id')) {
                    let categoryName = '';
                    if (product.category_id) {
                        try {
                            const category = await sequelize.models.Categories.findByPk(product.category_id);
                            if (category) {
                                categoryName = category.name;
                            }
                        } catch (error) {
                            console.error('Error fetching category for full_text_search:', error);
                        }
                    }
                    // Use to_tsvector to create the vector
                    // We need to use sequelize.fn and sequelize.literal because we are setting a value that is a function call
                    // However, setting a property on an instance to a sequelize.fn object might not work as expected in a beforeSave hook 
                    // if we want to access the value immediately. 
                    // But for saving to DB, it works.
                    // Actually, for beforeSave, we can just set the value to a literal string if we were using raw queries, 
                    // but with Sequelize instances, it's trickier.
                    // A common approach is to update it via a raw query AFTER save, or try to set it as a literal.
                    // Let's try setting it as a literal.

                    // Wait, Sequelize supports TSVECTOR. 
                    // But we can't easily run SQL functions inside the JS hook logic to *return* the value to the instance before save 
                    // without a round trip or using specific Sequelize syntax.

                    // Simpler approach for the hook:
                    // We can't easily compute the TSVECTOR in JS. 
                    // We should let the DB handle it.
                    // But `beforeSave` is JS.

                    // Alternative: Use a generated column (Postgres 12+) or a trigger.
                    // But the user asked for "create the content for that column".

                    // Let's try to set it using sequelize.fn.
                    product.full_text_search = sequelize.fn('to_tsvector', 'english', `${product.name} ${categoryName}`);
                }
            }
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
