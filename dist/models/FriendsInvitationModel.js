"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (sequelize, DataTypes) => {
    const FriendsInvitation = sequelize.define('FriendsInvitation', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    }, {
        tableName: 'friends_invitation',
    });
    FriendsInvitation.associate = (models) => {
        FriendsInvitation.belongsTo(models.User, {
            foreignKey: {
                allowNull: false,
                field: 'user',
                name: 'user'
            }
        });
        FriendsInvitation.belongsTo(models.User, {
            foreignKey: {
                allowNull: false,
                field: 'friend',
                name: 'friend'
            }
        });
    };
    return FriendsInvitation;
};
