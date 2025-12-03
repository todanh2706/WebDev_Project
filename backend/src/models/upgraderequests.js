export default (sequelize, DataTypes) => {
    const UpgradeRequests = sequelize.define('UpgradeRequests', {
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
        reason: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'pending'
        },
    });

    UpgradeRequests.associate = (models) => {
        UpgradeRequests.belongsTo(models.Users, {
            foreignKey: 'user_id',
            as: 'user'
        })
    }

    return UpgradeRequests;
}