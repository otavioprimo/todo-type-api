import * as Sequelize from 'sequelize';
import * as uuid from 'uuid/v4';

import { BaseModelInterface } from './../interfaces/BaseModelInterface';
import { ModelsInterface } from '../interfaces/ModelsInterface';

export interface TaskAttributes {
    id?: number;
    user?: number;
    friend?: number;
    title?: string;
    description?: string;
    share_token?: string;
    status?: boolean;
    expiration?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface TaskInstance extends Sequelize.Instance<TaskAttributes>, TaskAttributes { }

export interface TaskModel extends BaseModelInterface, Sequelize.Model<TaskInstance, TaskAttributes> { }

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): TaskModel => {
    const Task: TaskModel =
        sequelize.define('Tasks', {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true
            },
            status: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            share_token: {
                type: DataTypes.STRING,
                allowNull: false
            },
            expiration: {
                type: DataTypes.DATE,
                allowNull: true
            }
        }, {
                tableName: 'tasks',
                hooks: {
                    beforeCreate: (task: TaskInstance, options: Sequelize.CreateOptions): void => {
                        const token = uuid();
                        task.share_token = token;
                    }
                }
            });

    Task.associate = (models: ModelsInterface): void => {
        Task.belongsTo(models.User, {
            foreignKey: {
                allowNull: false,
                field: 'user',
                name: 'user'
            }
        });

        Task.belongsTo(models.User, {
            foreignKey: {
                allowNull: true,
                field: 'friend',
                name: 'friend'
            }
        })
    };

    return Task;
};
