import { TaskModel } from './TasksModel';
import * as Sequelize from 'sequelize';
import * as uuid from 'uuid/v4';
import * as UIDGenerator from 'uid-generator';

import { BaseModelInterface } from './../interfaces/BaseModelInterface';
import { ModelsInterface } from '../interfaces/ModelsInterface';

const uidgen = new UIDGenerator();

export interface TaskAttributes {
    id?: number;
    user?: number;
    friend?: number;
    title?: string;
    message?: string;
    shared_token?: string;
    public_id?: string;
    isList?: boolean;
    status?: boolean;
    private?: boolean;
    expiration?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface TaskInstance extends Sequelize.Instance<TaskAttributes>, TaskAttributes { }

export interface TaskModel extends BaseModelInterface, Sequelize.Model<TaskInstance, TaskAttributes> { }

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): TaskModel => {
    const Task: TaskModel =
        sequelize.define('Task', {
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
            message: {
                type: DataTypes.STRING,
                allowNull: true
            },
            status: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            shared_token: {
                type: DataTypes.STRING,
                allowNull: true,
                unique: true
            },
            public_id: {
                type: DataTypes.STRING,
                allowNull: true,
                unique: true
            },
            expiration: {
                type: DataTypes.DATE,
                allowNull: true
            },
            private: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: 1
            },
            isList: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: 0
            }
        }, {
                tableName: 'tasks',
                hooks: {
                    beforeCreate: (task: TaskInstance, options: Sequelize.CreateOptions): void => {
                        const Op = Sequelize.Op;

                        let _public_id: string;
                        let _shared_token: string;
                        let canExit: boolean = false;

                        do {
                            uidgen.generate()
                                .then(token => {
                                    _public_id = token
                                    _shared_token = uuid();

                                    let task = Task.find({
                                        where: {
                                            [Op.or]: [{ public_id: _public_id }, { shared_token: _shared_token }]
                                        }
                                    });

                                    if (!task) {
                                        canExit = true;
                                    }
                                });
                        } while (!canExit);

                        task.public_id = _public_id;
                        task.shared_token = _shared_token;
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
        });
    };

    return Task;
};