"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require("uuid/v4");
const randtoken = require("rand-token");
exports.default = (sequelize, DataTypes) => {
    const Task = sequelize.define('Task', {
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
            defaultValue: false
        }
    }, {
        tableName: 'tasks',
        hooks: {
            beforeCreate: (task, options) => {
                task.shared_token = uuid();
                task.public_id = randtoken.generate(30);
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
