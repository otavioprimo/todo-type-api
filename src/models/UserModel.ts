import * as Sequelize from 'sequelize';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';

import { BaseModelInterface } from './../interfaces/BaseModelInterface';
import { ModelsInterface } from '../interfaces/ModelsInterface';

export interface UserAttributes {
    id?: number;
    name?: string;
    email?: string;
    username?: string;
    password?: string;
    email_confirmed?: boolean;
    photo_base64?: string;
    photo_url?: string;
    status?: boolean;
    onesignal_id?: string;
    google_id?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface UserInstance extends Sequelize.Instance<UserAttributes>, UserAttributes {
    isPassword(encodedPassword: string, password: string): boolean;
}

export interface UserModel extends BaseModelInterface, Sequelize.Model<UserInstance, UserAttributes> { }


export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): UserModel => {
    const User: UserModel =
        sequelize.define('User', {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING(128),
                allowNull: false
            },
            email: {
                type: DataTypes.STRING(128),
                allowNull: false,
                unique: true
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            email_confirmed: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: 0
            },
            password: {
                type: DataTypes.STRING(128),
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },
            photo_base64: {
                type: DataTypes.BLOB('medium'),
                allowNull: true,
                defaultValue: null
            },
            photo_url: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: null
            },
            status: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: 1
            },
            onesignal_id: {
                type: DataTypes.STRING,
                allowNull: true
            },
            google_id: {
                type: DataTypes.STRING,
                allowNull: true
            }
        }, {
                tableName: 'users',
                hooks: {
                    beforeCreate: (user: UserInstance, options: Sequelize.CreateOptions): void => {
                        const salt = genSaltSync();
                        user.password = hashSync(user.password, salt);

                        // if (!user.changed('photo')) {
                        //     user.photo_url = `https://api.adorable.io/avatar/80/${user.username}`;
                        // }
                    },
                    beforeUpdate: (user: UserInstance, options: Sequelize.CreateOptions): void => {
                        if (user.changed('password')) {
                            const salt = genSaltSync();
                            user.password = hashSync(user.password, salt);
                        }
                    },
                    afterFind: (user: UserInstance, options: Sequelize.CreateOptions): void => {
                        if (user) {
                            if (user.photo_base64) {
                                user.photo_base64 = new Buffer(user.photo_base64).toString('base64');

                            }
                        }
                    }
                }
            });

    User.associate = (models: ModelsInterface): void => { };

    User.prototype.isPassword = (encodedPassword: string, password: string): boolean => {
        return compareSync(password, encodedPassword);
    }

    return User;
};
