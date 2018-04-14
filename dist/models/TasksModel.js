"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require("uuid/v4");
exports.default = (sequelize, DataTypes) => {
    const Task = sequelize.define('Tasks', {
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
            beforeCreate: (task, options) => {
                const token = uuid();
                task.share_token = token;
            }
        }
    });
    Task.associate = (models) => {
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
