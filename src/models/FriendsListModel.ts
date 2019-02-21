import * as Sequelize from 'sequelize';

import { BaseModelInterface } from './../interfaces/BaseModelInterface';
import { ModelsInterface } from '../interfaces/ModelsInterface';

export interface FriendsListAttributes {
    id?: number;
    user?: number;
    friend?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface FriendsListInstance extends Sequelize.Instance<FriendsListAttributes>, FriendsListAttributes { }

export interface FriendsListModel extends BaseModelInterface, Sequelize.Model<FriendsListInstance, FriendsListAttributes> { }

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): FriendsListModel => {
    const FriendsList: FriendsListModel =
        sequelize.define('FriendsList', {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            }
        }, {
                tableName: 'friends_list',
            });

    FriendsList.associate = (models: ModelsInterface): void => {
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
