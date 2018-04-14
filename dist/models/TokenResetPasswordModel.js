"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require("uuid/v4");
exports.default = (sequelize, DataTypes) => {
    const TokenResetPassword = sequelize.define('TokenResetPassword', {
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
        tableName: 'token_reset_password',
        hooks: {
            beforeCreate: (tokenResetPassword, options) => {
                const token = uuid();
                tokenResetPassword.token = token;
            }
        }
    });
    TokenResetPassword.associate = (models) => {
        TokenResetPassword.belongsTo(models.User, {
            foreignKey: {
                allowNull: false,
                field: 'user',
                name: 'user'
            }
        });
    };
    return TokenResetPassword;
};
