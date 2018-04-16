"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UIDGenerator = require("uid-generator");
const uidgen = new UIDGenerator();
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
                uidgen.generate()
                    .then(token => tokenResetPassword.token = token);
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
