"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (sequelize, DataTypes) => {
    const FriendsList = sequelize.define('FriendsList', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        }
    }, {
        tableName: 'friends_list',
    });
    FriendsList.associate = (models) => {
        FriendsList.belongsTo(models.User, {
            foreignKey: {
                allowNull: false,
                field: 'user',
                name: 'user'
            }
        });
        FriendsList.belongsTo(models.User, {
            foreignKey: {
                allowNull: false,
                field: 'friend',
                name: 'friend'
            }
        });
    };
    return FriendsList;
};
