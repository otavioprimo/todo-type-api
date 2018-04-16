import { TaskModel } from './TasksModel';
import * as Sequelize from 'sequelize';
import * as uuid from 'uuid/v4';
import * as UIDGenerator from 'uid-generator';

import { BaseModelInterface } from './../interfaces/BaseModelInterface';
import { ModelsInterface } from '../interfaces/ModelsInterface';

const uidgen = new UIDGenerator();

export interface TaskCheckListAttributes {
    id?: number;
    check?: boolean,
    task?: number;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface TaskCheckListInstance extends Sequelize.Instance<TaskCheckListAttributes>, TaskCheckListAttributes { }

export interface TaskCheckListModel extends BaseModelInterface, Sequelize.Model<TaskCheckListInstance, TaskCheckListAttributes> { }

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): TaskModel => {
    const TaskCheckList: TaskModel =
        sequelize.define('TaskCheckList', {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            check: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false
            }
        }, {
                tableName: 'task_check_list'
            });

    TaskCheckList.associate = (models: ModelsInterface): void => {
        TaskCheckList.belongsTo(models.Task, {
            foreignKey: {
                allowNull: true,
                field: 'task',
                name: 'task'
            }
        });
    };

    return TaskCheckList;
};