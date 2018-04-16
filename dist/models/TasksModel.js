"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sequelize = require("sequelize");
const uuid = require("uuid/v4");
const UIDGenerator = require("uid-generator");
const uidgen = new UIDGenerator();
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
            defaultValue: 1
        }
    }, {
        tableName: 'tasks',
        hooks: {
            beforeCreate: (task, options) => {
                const Op = Sequelize.Op;
                let _public_id;
                let _shared_token;
                let canExit = false;
                do {
                    uidgen.generate()
                        .then(token => {
                        _public_id = token;
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
