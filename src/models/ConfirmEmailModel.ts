import * as Sequelize from 'sequelize';
import * as UIDGenerator from 'uid-generator';

import { BaseModelInterface } from './../interfaces/BaseModelInterface';
import { ModelsInterface } from '../interfaces/ModelsInterface';

const uidgen = new UIDGenerator();

export interface ConfirmEmailAttributes {
    id?: number;
    user?: number;
    token?: string;
    status?: boolean;
    expiration?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ConfirmEmailInstance extends Sequelize.Instance<ConfirmEmailAttributes>, ConfirmEmailAttributes { }

export interface ConfirmEmailModel extends BaseModelInterface, Sequelize.Model<ConfirmEmailInstance, ConfirmEmailAttributes> { }


export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): ConfirmEmailModel => {
    const ConfirmEmail: ConfirmEmailModel =
        sequelize.define('ConfirmEmail', {
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
                tableName: 'confirm_email',
                hooks: {
                    beforeCreate: (confirmEmail: ConfirmEmailInstance, options: Sequelize.CreateOptions): void => {
                        uidgen.generate()
                            .then(token => confirmEmail.token = token);
                    }
                }
            });

    ConfirmEmail.associate = (models: ModelsInterface): void => {
        ConfirmEmail.belongsTo(models.User, {
            foreignKey: {
                allowNull: false,
                field: 'user',
                name: 'user'
            }
        });
    };

    return ConfirmEmail;
};