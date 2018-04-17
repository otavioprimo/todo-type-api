import * as Sequelize from 'sequelize';
import * as UIDGenerator from 'uid-generator';
import * as moment from 'moment';

import { BaseModelInterface } from './../interfaces/BaseModelInterface';
import { ModelsInterface } from '../interfaces/ModelsInterface';

const uidgen = new UIDGenerator();

export interface TokenResetPasswordAttributes {
    id?: number;
    user?: number;
    token?: string;
    status?: boolean;
    expiration?: moment.Moment;
    createdAt?: string;
    updatedAt?: string;
}

export interface TokenResetPasswordInstance extends Sequelize.Instance<TokenResetPasswordAttributes>, TokenResetPasswordAttributes { }

export interface TokenResetPasswordModel extends BaseModelInterface, Sequelize.Model<TokenResetPasswordInstance, TokenResetPasswordAttributes> { }


export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): TokenResetPasswordModel => {
    const TokenResetPassword: TokenResetPasswordModel =
        sequelize.define('TokenResetPassword', {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            token: {
                type: DataTypes.STRING,
                allowNull: false
            },
            expiration: {
                type: DataTypes.DATE,
                allowNull: true
            },
            status: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            }
        }, {
                tableName: 'token_reset_password',
                hooks: {
                    beforeCreate: (tokenResetPassword: TokenResetPasswordInstance, options: Sequelize.CreateOptions): void => {
                        tokenResetPassword.expiration = moment().add(45, "hours");
                    }
                }
            });

    TokenResetPassword.associate = (models: ModelsInterface): void => {
        TokenResetPassword.belongsTo(models.User, {
            foreignKey: {
                allowNull: false,
                field: 'user',
                name: 'user'
            }
        });
    };

    return TokenResetPassword;
};