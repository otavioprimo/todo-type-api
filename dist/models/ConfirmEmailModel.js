"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require("uuid/v4");
exports.default = (sequelize, DataTypes) => {
    const ConfirmEmail = sequelize.define('ConfirmEmail', {
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
        tableName: 'confirm_email',
        hooks: {
            beforeCreate: (confirmEmail, options) => {
                const token = uuid();
                confirmEmail.token = token;
            }
        }
    });
    ConfirmEmail.associate = (models) => {
        ConfirmEmail.belongsTo(models.User, {
            foreignKey: {
                allowNull: false,
                field: 'user',
                name: 'user'
            }
        });
    };
    return ConfirmEmail;
};
