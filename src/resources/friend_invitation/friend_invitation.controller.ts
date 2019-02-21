import { ModelsInterface } from './../../interfaces/ModelsInterface';
import * as HttpStatus from 'http-status-codes';
import { IFriendInvitation } from './friend_invitation.interface';
import { Op, Transaction } from 'sequelize';

import db from '../../models';
import EnviarEmail from '../../services/send_email';
import { FriendsInvitationInstance } from '../../models/FriendsInvitationModel';

export class FriendInvitationController implements IFriendInvitation {
    enviarConvite(req: any, res: any): void {
        req.checkBody("amigo_id").exists().notEmpty();
        req.checkBody("mensagem").exists();

        var errors = req.validationErrors();

        if (errors) {
            res.status(HttpStatus.BAD_REQUEST).json(errors);
            return;
        } else {
            db.FriendsInvitation.findOne({
                where: {
                    friend: req.body.amigo_id,
                    user: req.user.id,
                    status: true
                }
            }).then(temConvite => {
                if (!temConvite) {
                    db.sequelize.transaction((t: Transaction) => {
                        return db.FriendsInvitation.create({
                            user: req.user.id,
                            friend: req.body.amigo_id,
                            message: req.body.mensagem
                        }, { transaction: t });
                    }).then(data => {
                        db.User.findById(req.user.id)
                            .then(user => {
                                db.User.findById(req.body.amigo_id)
                                    .then(amigo => {
                                        res.status(HttpStatus.OK).json({ error: false, mensagem: "Pedido enviado com sucesso" });
                                    });
                            });
                    });
                } else {
                    res.status(HttpStatus.OK).json({ error: true, mensagem: "Você já tem um pedido de amizade pendente com esta pessoas" });
                }
            })
        }
    }
    aceitarRecusarConvite(req: any, res: any): void {
        req.checkBody("pedido_id", "Necessário um id do pedido de amizade").exists();
        req.checkBody("status", "Status é um Boolean indicado se foi aceito ou não o pedido").exists().isBoolean();

        var errors = req.validationErrors();
        if (errors) {
            res.status(HttpStatus.BAD_REQUEST).json(errors);
            return;
        } else {
            db.FriendsInvitation.findById(req.body.pedido_id)
                .then((friendInvitation: FriendsInvitationInstance) => {
                    db.sequelize.transaction((t: Transaction) => {
                        return friendInvitation.update({ status: false }, { transaction: t })
                            .then(data => {
                                if (req.body.status == true) {
                                    db.FriendsList.create({ user: req.user.id, friend: friendInvitation.user });
                                    db.FriendsList.create({ user: friendInvitation.user, friend: req.user.id });
                                }
                            });
                    }).then(data => {
                        res.status(HttpStatus.OK).json({ error: false, mensagem: "Pedido aceitado/recusado com sucesso" });
                    }).catch(err => {
                        console.log(err);
                        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: true, mensagem: "Falha ao aceitar/recusar pedido" });
                    });
                });
        }
    }
    convitesPendentes(req: any, res: any): void {
        req.checkQuery("page").exists().notEmpty();
        req.checkQuery("limit").exists().notEmpty();
        var errors = req.validationErrors();

        if (errors) {
            res.status(HttpStatus.BAD_REQUEST).json(errors);
            return;
        } else {

            let page = (Number(req.query.page) - 1);
            let offset = page * req.query.limit;

            db.sequelize.query(`
                select a.id, a.message, a.status, a.friend, b.name,b.username,b.photo_url
                from friends_invitation a
                left join users b ON a.friend = b.id
                where a.user = ${req.user.id}
                and a.status = 1
                limit ${req.query.limit}
                offset ${offset}`,
                { model: db.FriendsInvitation })
                .then(data => {
                    res.send(data);
                });
        }
    }
}

export default new FriendInvitationController();