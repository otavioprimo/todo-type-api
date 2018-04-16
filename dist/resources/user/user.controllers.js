"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../../models");
const default_variables_1 = require("../../config/default_variables");
const sequelize_1 = require("sequelize");
const HttpStatus = require("http-status-codes");
const jwt = require("jsonwebtoken");
class UserController {
    getUsuariosFiltro(req, res) {
        throw new Error("Method not implemented.");
    }
    getByUsername(req, res) {
        models_1.default.User.findOne({ where: { username: req.params.username }, attributes: { exclude: ['password'] } })
            .then((user) => {
            if (!user)
                res.status(HttpStatus.NOT_FOUND).json({ error: true, message: 'Usuário não encontrado' });
            else
                res.status(HttpStatus.OK).json({ error: false, data: user });
        });
    }
    getPerfilById(req, res) {
        models_1.default.User.findById(req.user.id, { attributes: { exclude: ['password'] } })
            .then((user) => {
            res.status(HttpStatus.OK).json(user);
        });
    }
    searchByUsername(req, res) {
        req.checkQuery("param").exists();
        var errors = req.validationErrors();
        if (errors) {
            res.status(HttpStatus.BAD_REQUEST).json(errors);
            return;
        }
        else {
            models_1.default.User.findAll({ where: { username: { [sequelize_1.Op.like]: req.query.param } }, attributes: { exclude: ['password'] } })
                .then((user) => {
                res.status(HttpStatus.OK).json(user);
            });
        }
    }
    cadastrar(req, res) {
        req.checkBody("email").exists().isEmail;
        req.checkBody("username").exists();
        req.checkBody("senha").exists().isLength({ min: 6, max: 20 });
        var errors = req.validationErrors();
        if (isUsername(req.body.username)) {
            res.status(HttpStatus.BAD_REQUEST).json({ erro: true, mensagem: "username com formato inválido" });
        }
        if (errors) {
            res.status(HttpStatus.BAD_REQUEST).json(errors);
            return;
        }
        else {
            //Cadastrar
        }
    }
    login(req, res) {
        req.checkBody("email").exists();
        req.checkBody("senha").exists();
        var errors = req.validationErrors();
        if (errors) {
            res.status(HttpStatus.BAD_REQUEST).json(errors);
            return;
        }
        else {
            let email = req.body.email;
            let splited_email = email.split('@');
            let isEmail = splited_email.length > 1 ? true : false;
            //Faz Login com email
            if (isEmail) {
                models_1.default.User.find({ where: { email: req.body.email } })
                    .then((user) => {
                    if (user) {
                        let isPassword = user.isPassword(user.password, req.body.senha);
                        if (isPassword) {
                            var token = jwt.sign({ id: user.id, email: user.email }, default_variables_1.default.jwt_token, {
                                expiresIn: '360d'
                            });
                            res.status(HttpStatus.OK).json({ error: false, token: token });
                        }
                        else {
                            res.status(HttpStatus.UNAUTHORIZED);
                        }
                    }
                    else {
                        res.status(HttpStatus.UNAUTHORIZED);
                    }
                });
            }
            else {
                models_1.default.User.find({ where: { username: req.body.email } })
                    .then((user) => {
                    if (user) {
                        let isPassword = user.isPassword(user.password, req.body.senha);
                        if (isPassword) {
                            var token = jwt.sign({ id: user.id, email: user.email }, default_variables_1.default.jwt_token, {
                                expiresIn: '360d'
                            });
                            res.status(HttpStatus.OK).json({ error: false, token: token });
                        }
                        else {
                            res.status(HttpStatus.UNAUTHORIZED);
                        }
                    }
                    else {
                        res.status(HttpStatus.UNAUTHORIZED);
                    }
                });
            }
        }
    }
    loginGoogle(req, res) {
        throw new Error("Method not implemented.");
    }
    atualizar(req, res) {
        throw new Error("Method not implemented.");
    }
    atualizarFoto(req, res) {
        throw new Error("Method not implemented.");
    }
    atualizarSenha(req, res) {
        throw new Error("Method not implemented.");
    }
    confirmarEmail(req, res) {
        throw new Error("Method not implemented.");
    }
    enviarConfirmarEmail(req, res) {
        throw new Error("Method not implemented.");
    }
    recuperarSenha(req, res) {
        throw new Error("Method not implemented.");
    }
}
function isUsername(username) {
    let _split = username.split("@");
    if (_split.length == 1)
        return true;
    else
        return false;
}
exports.default = new UserController();
