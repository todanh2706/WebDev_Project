export default (sequelize, DataTypes) => {
    const BidPermissionRequest = sequelize.define('BidPermissionRequest', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
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
        status: {
            type: DataTypes.ENUM('pending', 'approved', 'rejected'),
            defaultValue: 'pending'
        }
    });

    BidPermissionRequest.associate = (models) => {
        BidPermissionRequest.belongsTo(models.Users, {
            foreignKey: 'user_id',
            as: 'user'
        });
        BidPermissionRequest.belongsTo(models.Products, {
            foreignKey: 'product_id',
            as: 'product'
        });
    };

    return BidPermissionRequest;
};
