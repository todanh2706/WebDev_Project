export default (sequelize, DataTypes) => {
    const ChatMessages = sequelize.define('ChatMessages', {
        message_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        order_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Orders',
                key: 'order_id'
            }
        },
        sender_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        receiver_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false
        },
        send_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    });

    ChatMessages.associate = (models) => {
        ChatMessages.belongsTo(models.Users, {
            foreignKey: 'sender_id',
            as: 'sender'
        });
        ChatMessages.belongsTo(models.Users, {
            foreignKey: 'receiver_id',
            as: 'receiver'
        });
        ChatMessages.belongsTo(models.Orders, {
            foreignKey: 'order_id',
            as: 'order'
        });
    };

    return ChatMessages;
}