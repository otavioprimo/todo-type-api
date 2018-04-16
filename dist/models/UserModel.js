"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = require("bcryptjs");
exports.default = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
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
        photo: {
            type: DataTypes.BLOB({ length: 'long' }),
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
            beforeCreate: (user, options) => {
                const salt = bcryptjs_1.genSaltSync();
                user.password = bcryptjs_1.hashSync(user.password, salt);
            },
            beforeUpdate: (user, options) => {
                if (user.changed('password')) {
                    const salt = bcryptjs_1.genSaltSync();
                    user.password = bcryptjs_1.hashSync(user.password, salt);
                }
            }
        }
    });
    User.associate = (models) => { };
    User.prototype.isPassword = (encodedPassword, password) => {
        return bcryptjs_1.compareSync(password, encodedPassword);
    };
    return User;
};
