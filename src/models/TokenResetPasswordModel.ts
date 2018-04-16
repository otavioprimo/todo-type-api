import * as Sequelize from 'sequelize';
import * as UIDGenerator from 'uid-generator';

import { BaseModelInterface } from './../interfaces/BaseModelInterface';
import { ModelsInterface } from '../interfaces/ModelsInterface';

const uidgen = new UIDGenerator();

export interface TokenResetPasswordAttributes {
    id?: number;
    user?: number;
    token?: string;
    status?: boolean;
    expiration?: string;
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
                allowNull: false
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
                        uidgen.generate()
                            .then(token => tokenResetPassword.token = token);
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