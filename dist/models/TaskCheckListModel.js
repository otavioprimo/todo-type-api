"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UIDGenerator = require("uid-generator");
const uidgen = new UIDGenerator();
exports.default = (sequelize, DataTypes) => {
    const TaskCheckList = sequelize.define('TaskCheckList', {
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
    TaskCheckList.associate = (models) => {
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
