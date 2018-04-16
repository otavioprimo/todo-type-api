import { UserAttributes, UserInstance } from './../../models/UserModel';
import db from '../../models';
import { IUserController } from './user.interface';
import { Router, Request, Response } from 'express';
import default_configs from "../../config/default_variables";
import { Op } from 'sequelize';
import * as HttpStatus from 'http-status-codes';
import * as jwt from 'jsonwebtoken';

import Mail from '../../services/mail';

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
        var errors = req.validationErrors();

        if (errors) {
            res.status(HttpStatus.BAD_REQUEST).json(errors);
            return;
        } else {
            db.User.findAll({ where: { username: { [Op.like]: req.query.param } }, attributes: { exclude: ['password'] } })
                .then((user: UserInstance[]) => {
                    res.status(HttpStatus.OK).json(user);
                });
        }
    }
    cadastrar(req: Request, res: Response): void {
        req.checkBody("email").exists().isEmail;
        req.checkBody("username").exists();
        req.checkBody("senha").exists().isLength({ min: 6, max: 20 });
        var errors = req.validationErrors();

        if (isUsername(req.body.username)) {
            res.status(HttpStatus.BAD_REQUEST).json({ erro: true, mensagem: "username com formato inválido" })
        }

        if (errors) {
            res.status(HttpStatus.BAD_REQUEST).json(errors);
            return;
        } else {
            //Cadastrar
        }
    }
    login(req: Request, res: Response): void {
        req.checkBody("email").exists();
        req.checkBody("senha").exists();
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
                                var token = jwt.sign({ id: user.id, email: user.email }, default_configs.jwt_token, {
                                    expiresIn: '360d'
                                });
                                res.status(HttpStatus.OK).json({ error: false, token: token });
                            } else {
                                res.status(HttpStatus.UNAUTHORIZED);
                            }
                        } else {
                            res.status(HttpStatus.UNAUTHORIZED);
                        }
                    });
            } else {//Faz Login com username
                db.User.find({ where: { username: req.body.email } })
                    .then((user: UserInstance) => {
                        if (user) {
                            let isPassword = user.isPassword(user.password, req.body.senha);
                            if (isPassword) {
                                var token = jwt.sign({ id: user.id, email: user.email }, default_configs.jwt_token, {
                                    expiresIn: '360d'
                                });
                                res.status(HttpStatus.OK).json({ error: false, token: token });
                            } else {
                                res.status(HttpStatus.UNAUTHORIZED);
                            }
                        } else {
                            res.status(HttpStatus.UNAUTHORIZED);
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
        throw new Error("Method not implemented.");
    }
    confirmarEmail(req: Request, res: Response): void {
        throw new Error("Method not implemented.");
    }
    enviarConfirmarEmail(req: Request, res: Response): void {
        throw new Error("Method not implemented.");
    }
    recuperarSenha(req: Request, res: Response): void {
        throw new Error("Method not implemented.");
    }
    // public testeEmail(req: Request, res: Response): void {
    // req.checkQuery("email").exists().isEmail();
    // var errors = req.validationErrors();

    // if (errors) {
    //     res.status(HttpStatus.BAD_REQUEST).json(errors);
    //     return;
    // } else {
    //     Mail.to = req.query.email;
    //     Mail.subject = 'sasad';
    //     Mail.message = 'Body sasad';

    //     let result = Mail.sendMail();

    //     res.status(HttpStatus.OK).json({ error: false, message: 'enviado' })
    // }
    // }

}

function isUsername(username: string) {
    let _split = username.split("@");
    if (_split.length == 1)
        return true;
    else
        return false;
}

export default new UserController();