"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpStatus = require("http-status-codes");
const models_1 = require("../../models");
class FriendInvitationController {
    enviarConvite(req, res) {
        req.checkBody("amigo_id").exists().notEmpty();
        req.checkBody("mensagem").exists();
        var errors = req.validationErrors();
        if (errors) {
            res.status(HttpStatus.BAD_REQUEST).json(errors);
            return;
        }
        else {
            models_1.default.FriendsInvitation.findOne({
                where: {
                    friend: req.body.amigo_id,
                    user: req.user.id,
                    status: true
                }
            }).then(temConvite => {
                if (!temConvite) {
                    models_1.default.sequelize.transaction((t) => {
                        return models_1.default.FriendsInvitation.create({
                            user: req.user.id,
                            friend: req.body.amigo_id,
                            message: req.body.mensagem
                        }, { transaction: t });
                    }).then(data => {
                        models_1.default.User.findById(req.user.id)
                            .then(user => {
                            models_1.default.User.findById(req.body.amigo_id)
                                .then(amigo => {
                                res.status(HttpStatus.OK).json({ error: false, mensagem: "Pedido enviado com sucesso" });
                            });
                        });
                    });
                }
                else {
                    res.status(HttpStatus.OK).json({ error: true, mensagem: "Você já tem um pedido de amizade pendente com esta pessoas" });
                }
            });
        }
    }
    aceitarRecusarConvite(req, res) {
        req.checkBody("pedido_id", "Necessário um id do pedido de amizade").exists();
        req.checkBody("status", "Status é um Boolean indicado se foi aceito ou não o pedido").exists().isBoolean();
        var errors = req.validationErrors();
        if (errors) {
            res.status(HttpStatus.BAD_REQUEST).json(errors);
            return;
        }
        else {
            models_1.default.FriendsInvitation.findById(req.body.pedido_id)
                .then((friendInvitation) => {
                models_1.default.sequelize.transaction((t) => {
                    return friendInvitation.update({ status: false }, { transaction: t })
                        .then(data => {
                        if (req.body.status == true) {
                            models_1.default.FriendsList.create({ user: req.user.id, friend: friendInvitation.user });
                            models_1.default.FriendsList.create({ user: friendInvitation.user, friend: req.user.id });
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
    convitesPendentes(req, res) {
        req.checkQuery("page").exists().notEmpty();
        req.checkQuery("limit").exists().notEmpty();
        var errors = req.validationErrors();
        if (errors) {
            res.status(HttpStatus.BAD_REQUEST).json(errors);
            return;
        }
        else {
            let page = (Number(req.query.page) - 1);
            let offset = page * req.query.limit;
            models_1.default.sequelize.query(`
                select a.id, a.message, a.status, a.friend, b.name,b.username,b.photo_url
                from friends_invitation a
                left join users b ON a.friend = b.id
                where a.user = ${req.user.id}
                and a.status = 1
                limit ${req.query.limit}
                offset ${offset}`, { model: models_1.default.FriendsInvitation })
                .then(data => {
                res.send(data);
            });
        }
    }
}
exports.FriendInvitationController = FriendInvitationController;
exports.default = new FriendInvitationController();
