"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const models_1 = require("../../models");
const default_variables_1 = require("../../config/default_variables");
const send_email_1 = require("../../services/send_email");
const HttpStatus = require("http-status-codes");
const jwt = require("jsonwebtoken");
const UIDGenerator = require("uid-generator");
const moment = require("moment");
const uidgen = new UIDGenerator();
class UserController {
    getUsuariosFiltro(req, res) {
        throw new Error("Method not implemented.");
    }
    getById(req, res) {
        models_1.default.User.findById(req.params.id, { attributes: { exclude: ['photo_base64', 'password', 'status', 'updatedAt', 'createdAt', 'google_id', 'onesignal_id'] } })
            .then(user => {
            if (user) {
                if (user.id != req.user.id) {
                    models_1.default.FriendsList.findOne({ where: { friend: user.id, user: req.user.id } })
                        .then((friend) => {
                        let finalUser = {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            username: user.username,
                            photo_url: user.photo_url
                        };
                        if (friend) {
                            finalUser.isFriend = true;
                        }
                        else {
                            finalUser.isFriend = false;
                        }
                        res.status(HttpStatus.OK).json({ error: false, data: finalUser });
                    });
                }
                else {
                    res.status(HttpStatus.OK).json({ error: false, data: user });
                }
            }
            else
                res.status(HttpStatus.NOT_FOUND).json({ error: true, message: 'Usuário não encontrado' });
        });
    }
    getByUsername(req, res) {
        models_1.default.User.findOne({ where: { username: req.params.username }, attributes: { exclude: ['photo_base64', 'password', 'status', 'updatedAt', 'createdAt', 'google_id', 'onesignal_id'] } })
            .then((user) => {
            if (user) {
                if (user.id != req.user.id) {
                    models_1.default.FriendsList.findOne({ where: { friend: user.id, user: req.user.id } })
                        .then((friend) => {
                        let finalUser = {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            username: user.username,
                            photo: user.photo
                        };
                        if (friend) {
                            finalUser.isFriend = true;
                        }
                        else {
                            finalUser.isFriend = false;
                        }
                        res.status(HttpStatus.OK).json({ error: false, data: finalUser });
                    });
                }
                else {
                    res.status(HttpStatus.OK).json({ error: false, data: user });
                }
            }
            else
                res.status(HttpStatus.NOT_FOUND).json({ error: true, message: 'Usuário não encontrado' });
        });
    }
    getPerfilById(req, res) {
        models_1.default.User.findById(req.user.id, { attributes: { exclude: ['photo_base64', 'password'] } })
            .then((user) => {
            res.status(HttpStatus.OK).json(user);
        });
    }
    convertBase64toUrl(req, res) {
        models_1.default.User.findOne({ where: { username: req.params.username }, attributes: { exclude: ['password'] } })
            .then((user) => {
            if (user) {
                let foto = `data:image/png;base64,${user.photo_base64}`;
                var img = new Buffer(foto, 'base64');
                res.writeHead(200, {
                    'Content-Type': 'image/png',
                    'Content-Length': img.length
                });
                res.end(img);
            }
            else {
                res.status(HttpStatus.NOT_FOUND).send();
            }
        });
    }
    searchByUsername(req, res) {
        req.checkQuery("username").exists();
        req.checkQuery("page").exists().notEmpty();
        req.checkQuery("limit").exists().notEmpty();
        var errors = req.validationErrors();
        if (errors) {
            res.status(HttpStatus.BAD_REQUEST).json(errors);
            return;
        }
        else {
            let offset = (Number(req.query.page) - 1) * Number(req.query.limit);
            models_1.default.User.findAll({
                where: {
                    username: {
                        [sequelize_1.Op.like]: `%${req.query.username}%`
                    },
                    id: {
                        [sequelize_1.Op.ne]: req.user.id
                    }
                },
                attributes: { exclude: ['photo_base64', 'password'] },
                order: ['name'],
                offset: Number(offset),
                limit: Number(req.query.limit)
            })
                .then((user) => {
                res.status(HttpStatus.OK).json(user);
            });
        }
    }
    cadastrar(req, res) {
        req.checkBody("email").exists().isEmail;
        req.checkBody("username").exists();
        req.checkBody("onesignal_id").exists();
        req.checkBody("name").exists();
        req.checkBody("senha").exists().isLength({ min: 6, max: 20 });
        var errors = req.validationErrors();
        if (errors) {
            res.status(HttpStatus.BAD_REQUEST).json(errors);
            return;
        }
        else {
            if (!isUsername(req.body.username)) {
                res.status(HttpStatus.BAD_REQUEST).json({ erro: true, mensagem: "username com formato inválido" });
                return;
            }
            //Verifica se o username já existe
            models_1.default.User.findOne({ where: { username: req.body.username }, attributes: { exclude: ['photo_base64'] } }).then(hasUser => {
                if (hasUser)
                    res.status(HttpStatus.BAD_REQUEST).json({ erro: true, mensagem: "Usuário já existe" });
                else {
                    //Verifica se o email já existe
                    models_1.default.User.findOne({ where: { email: req.body.email }, attributes: { exclude: ['photo_base64'] } }).then(hasEmail => {
                        if (hasEmail)
                            res.status(HttpStatus.BAD_REQUEST).json({ erro: true, mensagem: "Usuário já existe" });
                        else {
                            //Cria a conta de usuário
                            models_1.default.sequelize.transaction((t) => {
                                return models_1.default.User.create({
                                    email: req.body.email,
                                    username: req.body.username,
                                    name: req.body.name,
                                    password: req.body.senha,
                                    onesignal_id: req.body.onesignal_id
                                }, { transaction: t });
                            }).then((user) => {
                                //Gera o token para o confirmar email
                                uidgen.generate().then(token_email => {
                                    send_email_1.default.cadastro(req.body.email, req.body.name, token_email);
                                    models_1.default.ConfirmEmail.create({ user: user.id, token: token_email });
                                    //Envia o token de resposta
                                    var token = jwt.sign({ id: user.id, email: user.email, username: user.username }, default_variables_1.default.jwt_token, {
                                        expiresIn: '360d'
                                    });
                                    res.status(HttpStatus.OK).json({ error: false, token: token });
                                });
                            });
                        }
                    });
                }
            });
        }
    }
    login(req, res) {
        req.checkBody("email").exists();
        req.checkBody("senha").exists();
        req.checkBody("onesignal_id").exists();
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
                models_1.default.User.find({ where: { email: req.body.email }, attributes: { exclude: ['photo_base64'] } })
                    .then((user) => {
                    if (user) {
                        let isPassword = user.isPassword(user.password, req.body.senha);
                        if (isPassword) {
                            models_1.default.sequelize.transaction((t) => {
                                return user.update({ onesignal_id: req.body.onesignal_id }, { transaction: t });
                            });
                            var token = jwt.sign({ id: user.id, email: user.email, username: user.username }, default_variables_1.default.jwt_token, {
                                expiresIn: '360d'
                            });
                            res.status(HttpStatus.OK).json({ error: false, token: token });
                        }
                        else {
                            res.status(HttpStatus.UNAUTHORIZED).json({ error: true, mensagem: "Login Inválido" });
                            return;
                        }
                    }
                    else {
                        res.status(HttpStatus.UNAUTHORIZED).json({ error: true, mensagem: "Login Inválido" });
                        return;
                    }
                });
            }
            else {
                models_1.default.User.find({ where: { username: req.body.email }, attributes: { exclude: ['photo_base64'] } })
                    .then((user) => {
                    if (user) {
                        let isPassword = user.isPassword(user.password, req.body.senha);
                        if (isPassword) {
                            user.update({ onesignal_id: req.body.onesignal_id });
                            var token = jwt.sign({ id: user.id, email: user.email, username: user.username }, default_variables_1.default.jwt_token, {
                                expiresIn: '360d'
                            });
                            res.status(HttpStatus.OK).json({ error: false, token: token });
                        }
                        else {
                            res.status(HttpStatus.UNAUTHORIZED).json({ error: true, mensagem: "Login Inválido" });
                        }
                    }
                    else {
                        res.status(HttpStatus.UNAUTHORIZED).json({ error: true, mensagem: "Login Inválido" });
                    }
                });
            }
        }
    }
    loginGoogle(req, res) {
        throw new Error("Method not implemented.");
    }
    atualizar(req, res) {
        req.checkBody("nome").exists();
        var errors = req.validationErrors();
        if (errors) {
            res.status(HttpStatus.BAD_REQUEST).json(errors);
            return;
        }
        else {
            models_1.default.User.findById(req.user.id, { attributes: { exclude: ['photo_base64'] } })
                .then((user) => {
                models_1.default.sequelize.transaction((t) => {
                    return user.update({ name: req.body.name }, { transaction: t });
                }).then(data => {
                    res.status(HttpStatus.OK).json({ error: false, mensagem: "Atualizado com sucesso", data: data });
                }).catch(err => {
                    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: true, mensagem: "Falha ao atualizar dados" });
                });
            });
        }
    }
    atualizarFoto(req, res) {
        if (!req.files) {
            res.status(HttpStatus.OK).json({ error: true, mensagem: "Sem arquivos para upload" });
            return;
        }
        //cria o nome do arquivo
        let foto = 'avatar_' + req.user.id + '.jpg';
        let file = req.files.imagem; //Pega a imagem do request
        let path = `http://river-app-com-br.umbler.net/static/user/avatar/${foto}`;
        file.mv('./public/user/avatar/' + foto);
        models_1.default.sequelize.transaction((t) => {
            return models_1.default.User.update({
                photo_url: path
                // photo_base64: req.files.imagem.data,
                // photo_url: req.protocol + '://' + req.get('host') + '/v1/user/foto/' + req.user.username
            }, { where: { id: req.user.id }, transaction: t });
        }).then(user => {
            res.status(HttpStatus.OK).json({ error: false, mensagem: "Atualizado com sucesso" });
        }).catch(err => {
            res.status(HttpStatus.OK).json({ error: true, mensagem: "Falha ao atualizar foto de perfil", msg_err: err });
        });
    }
    atualizarSenha(req, res) {
        req.checkBody("old_password").exists().isLength({ min: 6, max: 20 });
        req.checkBody("password").exists().isLength({ min: 6, max: 20 });
        var errors = req.validationErrors();
        if (errors) {
            res.status(HttpStatus.BAD_REQUEST).json(errors);
            return;
        }
        else {
            models_1.default.User.findById(req.user.id, { attributes: { exclude: ['photo_base64'] } })
                .then((user) => {
                let isPassword = user.isPassword(user.password, req.body.old_password);
                if (isPassword) {
                    models_1.default.sequelize.transaction((t) => {
                        return user.update({ password: req.body.password });
                    }).then(data => {
                        res.status(HttpStatus.OK).json({ error: false, data: user, mensagem: "Atualizado com sucesso" });
                    });
                }
                else {
                    res.status(HttpStatus.OK).json({ error: true, mensagem: "Senha atual inválida" });
                }
            });
        }
    }
    atualizarRecuperarSenha(req, res) {
        req.checkBody("token").exists();
        req.checkBody("password").exists().isLength({ min: 6, max: 20 });
        ;
        var errors = req.validationErrors();
        if (errors) {
            res.status(HttpStatus.BAD_REQUEST).json(errors);
            return;
        }
        else {
            models_1.default.TokenResetPassword.findOne({
                where: {
                    token: req.body.token,
                    status: true,
                    expiration: { [sequelize_1.Op.gte]: moment().subtract(3, 'hours').toDate() }
                }
            })
                .then((hasToken) => {
                if (hasToken) {
                    hasToken.update({ status: false }).then(resp => {
                        models_1.default.sequelize.transaction((t) => {
                            return models_1.default.User.update({ password: req.body.password }, { where: { id: hasToken.user }, transaction: t });
                        }).then(data => {
                            res.send(HttpStatus.OK).json({ error: false, mensagem: "Senha Alterada com sucesso" });
                        });
                    });
                }
                else {
                    res.status(HttpStatus.NOT_FOUND).json({ error: true, mensagem: "Token Inválido" });
                    return;
                }
            });
        }
    }
    confirmarEmail(req, res) {
        req.checkBody("token").exists();
        var errors = req.validationErrors();
        if (errors) {
            res.status(HttpStatus.BAD_REQUEST).json(errors);
            return;
        }
        else {
            models_1.default.ConfirmEmail.findOne({
                where: {
                    token: req.body.token,
                    status: true,
                    expiration: { [sequelize_1.Op.gte]: moment().subtract(3, 'hours').toDate() }
                }
            })
                .then((hasToken) => {
                if (hasToken) {
                    hasToken.update({ status: false }).then(resp => {
                        models_1.default.sequelize.transaction((t) => {
                            return models_1.default.User.update({ email_confirmed: true }, { where: { id: hasToken.user }, transaction: t });
                        }).then(data => {
                            res.send(HttpStatus.OK).json({ error: false, mensagem: "Email Confirmado com sucesso" });
                        });
                    });
                }
                else {
                    res.status(HttpStatus.NOT_FOUND).json({ error: true, mensagem: "Token Inválido" });
                    return;
                }
            });
        }
    }
    enviarConfirmarEmail(req, res) {
        models_1.default.User.findById(req.user.id, { attributes: { exclude: ['photo_base64'] } })
            .then((user) => {
            uidgen.generate().then(token_email => {
                send_email_1.default.cadastro(user.email, user.name, token_email);
                models_1.default.sequelize.transaction((t) => {
                    return models_1.default.ConfirmEmail.create({ user: user.id, token: token_email }, { transaction: t });
                }).then(data => {
                    res.status(HttpStatus.OK).json({ error: false, mensagem: "Email enviado com sucesso, ele deverá chegar em instantes em sua caixa eletrônica" });
                });
            });
        }).catch(err => {
            res.status(HttpStatus.OK).json({ error: true, mensagem: "Não foi possível enviar o email" });
        });
    }
    recuperarSenha(req, res) {
        req.checkBody("email").exists().isEmail();
        var errors = req.validationErrors();
        if (errors) {
            res.status(HttpStatus.BAD_REQUEST).json(errors);
            return;
        }
        else {
            models_1.default.User.findOne({ where: { email: req.body.email }, attributes: { exclude: ['photo_base64'] } })
                .then((user) => {
                if (user) {
                    uidgen.generate().then(token => {
                        send_email_1.default.recuperarSenha(user.email, user.name, token);
                        models_1.default.sequelize.transaction((t) => {
                            return models_1.default.TokenResetPassword.create({ user: user.id, token: token }, { transaction: t });
                        }).then(data => {
                            res.status(HttpStatus.OK).json({ error: false, mensagem: "Email enviado com sucesso, ele deverá chegar em instantes em sua caixa eletrônica" });
                        });
                    });
                }
                else {
                    res.status(HttpStatus.OK).json({ error: true, mensagem: "Email não cadastrado" });
                }
            }).catch(err => {
                res.status(HttpStatus.OK).json({ error: true, mensagem: "Não foi possível enviar o email" });
            });
        }
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
