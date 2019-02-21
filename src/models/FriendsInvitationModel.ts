import * as Sequelize from 'sequelize';

import { BaseModelInterface } from './../interfaces/BaseModelInterface';
import { ModelsInterface } from '../interfaces/ModelsInterface';

export interface FriendsInvitationAttributes {
    id?: number;
    user?: number;
    friend?: number;
    message?: string;
    status?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface FriendsInvitationInstance extends Sequelize.Instance<FriendsInvitationAttributes>, FriendsInvitationAttributes { }

export interface FriendsInvitationModel extends BaseModelInterface, Sequelize.Model<FriendsInvitationInstance, FriendsInvitationAttributes> { }

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): FriendsInvitationModel => {
    const FriendsInvitation: FriendsInvitationModel =
        sequelize.define('FriendsInvitation', {
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

    FriendsInvitation.associate = (models: ModelsInterface): void => {
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
