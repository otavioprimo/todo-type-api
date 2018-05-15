"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UIDGenerator = require("uid-generator");
const moment = require("moment");
const uidgen = new UIDGenerator();
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
            allowNull: true
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
                confirmEmail.expiration = moment().add(45, "hours");
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
