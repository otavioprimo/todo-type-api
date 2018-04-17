import { ConfirmEmailInstance } from '../../models/ConfirmEmailModel';
import { IUserController } from './user.interface';
import { Op, Transaction } from 'sequelize';
import { Router, Request, Response } from 'express';
import { UserAttributes, UserInstance } from './../../models/UserModel';

import db from '../../models';
import default_configs from "../../config/default_variables";
import EnviarEmail from '../../services/send_email';

import * as HttpStatus from 'http-status-codes';
import * as jwt from 'jsonwebtoken';
import * as UIDGenerator from 'uid-generator';
import * as moment from 'moment';
import { TokenResetPasswordInstance } from '../../models/TokenResetPasswordModel';

const uidgen = new UIDGenerator();
class UserController implements IUserController {

    getUsuariosFiltro(req: Request, res: Response): void {
        throw new Error("Method not implemented.");
    }
    getByUsername(req: Request, res: Response): void {
        db.User.findOne({ where: { username: req.params.username }, attributes: { exclude: ['password'] } })
            .then((user: UserInstance) => {
                if (!user)
                    res.status(HttpStatus.NOT_FOUND).json({ error: true, message: 'Usuário não encontrado' });
                else
                    res.status(HttpStatus.OK).json({ error: false, data: user });
            });
    }
    getPerfilById(req: Request, res: Response): void {
        db.User.findById(req.user.id, { attributes: { exclude: ['password'] } })
            .then((user: UserInstance) => {
                res.status(HttpStatus.OK).json(user);
            });
    }
    searchByUsername(req: Request, res: Response): void {
        req.checkQuery("param").exists();
        req.checkQuery("page").exists().notEmpty();
        req.checkQuery("limit").exists().notEmpty();
        var errors = req.validationErrors();

        if (errors) {
            res.status(HttpStatus.BAD_REQUEST).json(errors);
            return;
        } else {
            let page = Number(req.query.page) - 1;

            db.User.findAll({
                where: {
                    username: {
                        [Op.like]: req.query.param
                    },
                    status: true
                },
                attributes: { exclude: ['password'] },
                order: ['name', 'DESC'],
                offset: Number(page),
                limit: Number(req.query.limit)
            })
                .then((user: UserInstance[]) => {
                    res.status(HttpStatus.OK).json(user);
                });
        }
    }
    cadastrar(req: Request, res: Response): void {
        req.checkBody("email").exists().isEmail;
        req.checkBody("username").exists();
        req.checkBody("onesignal_id").exists();
        req.checkBody("name").exists();
        req.checkBody("senha").exists().isLength({ min: 6, max: 20 });
        var errors = req.validationErrors();

        if (!isUsername(req.body.username)) {
            res.status(HttpStatus.BAD_REQUEST).json({ erro: true, mensagem: "username com formato inválido" });
            return;
        }

        if (errors) {
            res.status(HttpStatus.BAD_REQUEST).json(errors);
            return;
        } else {

            //Verifica se o username já existe
            db.User.findOne({ where: { username: req.body.username } }).then(hasUser => {
                if (hasUser)
                    res.status(HttpStatus.BAD_REQUEST).json({ erro: true, mensagem: "Usuário já existe" });
                else {
                    //Verifica se o email já existe
                    db.User.findOne({ where: { email: req.body.email } }).then(hasEmail => {
                        if (hasEmail)
                            res.status(HttpStatus.BAD_REQUEST).json({ erro: true, mensagem: "Usuário já existe" });
                        else {
                            //Cria a conta de usuário
                            db.sequelize.transaction((t: Transaction) => {
                                return db.User.create({
                                    email: req.body.email,
                                    username: req.body.username,
                                    name: req.body.name,
                                    password: req.body.senha,
                                    onesignal_id: req.body.onesignal_id
                                }, { transaction: t });
                            }).then((user: UserInstance) => {
                                //Gera o token para o confirmar email
                                uidgen.generate().then(token_email => {
                                    EnviarEmail.cadastro(req.body.email, req.body.name, token_email);
                                    db.ConfirmEmail.create({ user: user.id, token: token_email })

                                    //Envia o token de resposta
                                    var token = jwt.sign({ id: user.id, email: user.email }, default_configs.jwt_token, {
                                        expiresIn: '360d'
                                    });
                                    res.status(HttpStatus.OK).json({ error: false, token: token });
                                });
                            })
                        }
                    });
                }
            });

        }
    }
    login(req: Request, res: Response): void {
        req.checkBody("email").exists();
        req.checkBody("senha").exists();
        req.checkBody("onesignal_id").exists();
        var errors = req.validationErrors();

        if (errors) {
            res.status(HttpStatus.BAD_REQUEST).json(errors);
            return;
        } else {
            let email: string = req.body.email;
            let splited_email = email.split('@');
            let isEmail = splited_email.length > 1 ? true : false;

            //Faz Login com email
            if (isEmail) {
                db.User.find({ where: { email: req.body.email } })
                    .then((user: UserInstance) => {
                        if (user) {
                            let isPassword = user.isPassword(user.password, req.body.senha);

                            if (isPassword) {
                                db.sequelize.transaction((t: Transaction) => {
                                    return user.update({ onesignal_id: req.body.onesignal_id }, { transaction: t });
                                });
                                var token = jwt.sign({ id: user.id, email: user.email }, default_configs.jwt_token, {
                                    expiresIn: '360d'
                                });
                                res.status(HttpStatus.OK).json({ error: false, token: token });
                            } else {
                                res.status(HttpStatus.UNAUTHORIZED).json({ error: true, mensagem: "Login Inválido" });
                                return;
                            }
                        } else {
                            res.status(HttpStatus.UNAUTHORIZED).json({ error: true, mensagem: "Login Inválido" });
                            return;
                        }
                    });
            } else {//Faz Login com username
                db.User.find({ where: { username: req.body.email } })
                    .then((user: UserInstance) => {
                        if (user) {
                            let isPassword = user.isPassword(user.password, req.body.senha);
                            if (isPassword) {
                                user.update({ onesignal_id: req.body.onesignal_id });
                                var token = jwt.sign({ id: user.id, email: user.email }, default_configs.jwt_token, {
                                    expiresIn: '360d'
                                });
                                res.status(HttpStatus.OK).json({ error: false, token: token });
                            } else {
                                res.status(HttpStatus.UNAUTHORIZED).json({ error: true, mensagem: "Login Inválido" });
                            }
                        } else {
                            res.status(HttpStatus.UNAUTHORIZED).json({ error: true, mensagem: "Login Inválido" });
                        }
                    });
            }
        }
    }
    loginGoogle(req: Request, res: Response): void {
        throw new Error("Method not implemented.");
    }
    atualizar(req: Request, res: Response): void {
        throw new Error("Method not implemented.");
    }
    atualizarFoto(req: Request, res: Response): void {
        throw new Error("Method not implemented.");
    }
    atualizarSenha(req: Request, res: Response): void {
        req.checkBody("old_password").exists().isLength({ min: 6, max: 20 });;
        req.checkBody("password").exists().isLength({ min: 6, max: 20 });;
        var errors = req.validationErrors();

        if (errors) {
            res.status(HttpStatus.BAD_REQUEST).json(errors);
            return;
        } else {
            db.User.findById(req.user.id)
                .then((user: UserInstance) => {
                    let isPassword = user.isPassword(user.password, req.body.old_password);
                    if (isPassword) {
                        db.sequelize.transaction((t: Transaction) => {
                            return user.update({ password: req.body.password });
                        }).then(data => {
                            res.status(HttpStatus.OK).json({ error: false, data: user, mensagem: "Atualizado com sucesso" });
                        })
                    } else {
                        res.status(HttpStatus.OK).json({ error: true, mensagem: "Senha atual inválida" });
                    }
                });
        }
    }

    atualizarRecuperarSenha(req: Request, res: Response): void {
        req.checkBody("token").exists();
        req.checkBody("password").exists().isLength({ min: 6, max: 20 });;
        var errors = req.validationErrors();

        if (errors) {
            res.status(HttpStatus.BAD_REQUEST).json(errors);
            return;
        } else {
            db.TokenResetPassword.findOne({
                where: {
                    token: req.body.token,
                    status: true,
                    expiration: { [Op.gte]: moment().subtract(3, 'hours').toDate() }
                }
            })
                .then((hasToken: TokenResetPasswordInstance) => {
                    if (hasToken) {
                        hasToken.update({ status: false }).then(resp => {
                            db.sequelize.transaction((t: Transaction) => {
                                return db.User.update({ password: req.body.password }, { where: { id: hasToken.user }, transaction: t });
                            }).then(data => {
                                res.send(HttpStatus.OK).json({ error: false, mensagem: "Senha Alterada com sucesso" });
                            })
                        });
                    } else {
                        res.status(HttpStatus.NOT_FOUND).json({ error: true, mensagem: "Token Inválido" });
                        return;
                    }
                })
        }
    }

    confirmarEmail(req: Request, res: Response): void {
        req.checkBody("token").exists();
        var errors = req.validationErrors();

        if (errors) {
            res.status(HttpStatus.BAD_REQUEST).json(errors);
            return;
        } else {
            db.ConfirmEmail.findOne({
                where: {
                    token: req.body.token,
                    status: true,
                    expiration: { [Op.gte]: moment().subtract(3, 'hours').toDate() }
                }
            })
                .then((hasToken: ConfirmEmailInstance) => {
                    if (hasToken) {
                        hasToken.update({ status: false }).then(resp => {
                            db.sequelize.transaction((t: Transaction) => {
                                return db.User.update({ email_confirmed: true }, { where: { id: hasToken.user }, transaction: t });
                            }).then(data => {
                                res.send(HttpStatus.OK).json({ error: false, mensagem: "Email Confirmado com sucesso" });
                            })
                        });
                    } else {
                        res.status(HttpStatus.NOT_FOUND).json({ error: true, mensagem: "Token Inválido" });
                        return;
                    }
                })
        }
    }

    enviarConfirmarEmail(req: Request, res: Response): void {
        db.User.findById(req.user.id)
            .then((user: UserInstance) => {

                uidgen.generate().then(token_email => {
                    EnviarEmail.cadastro(user.email, user.name, token_email);
                    db.sequelize.transaction((t: Transaction) => {
                        return db.ConfirmEmail.create({ user: user.id, token: token_email }, { transaction: t });
                    }).then(data => {
                        res.status(HttpStatus.OK).json({ error: false, mensagem: "Email enviado com sucesso, ele deverá chegar em instantes em sua caixa eletrônica" });
                    });
                });

            }).catch(err => {
                res.status(HttpStatus.OK).json({ error: true, mensagem: "Não foi possível enviar o email" });
            })
    }

    recuperarSenha(req: Request, res: Response): void {
        req.checkBody("email").exists().isEmail();
        var errors = req.validationErrors();

        if (errors) {
            res.status(HttpStatus.BAD_REQUEST).json(errors);
            return;
        } else {
            db.User.findOne({ where: { email: req.body.email } })
                .then((user: UserInstance) => {
                    if (user) {
                        uidgen.generate().then(token => {
                            EnviarEmail.recuperarSenha(user.email, user.name, token);
                            db.sequelize.transaction((t: Transaction) => {
                                return db.TokenResetPassword.create({ user: user.id, token: token }, { transaction: t });
                            }).then(data => {
                                res.status(HttpStatus.OK).json({ error: false, mensagem: "Email enviado com sucesso, ele deverá chegar em instantes em sua caixa eletrônica" });
                            })
                        });
                    } else {
                        res.status(HttpStatus.OK).json({ error: true, mensagem: "Email não cadastrado" });
                    }
                }).catch(err => {
                    res.status(HttpStatus.OK).json({ error: true, mensagem: "Não foi possível enviar o email" });
                })
        }
    }
}

function isUsername(username: string) {
    let _split = username.split("@");
    if (_split.length == 1)
        return true;
    else
        return false;
}

export default new UserController();