"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpStatus = require("http-status-codes");
const models_1 = require("../../models");
class FriendListController {
    buscarAmigos(req, res) {
        req.checkQuery("page").exists().notEmpty();
        req.checkQuery("limit").exists().notEmpty();
        var errors = req.validationErrors();
        let offset = (Number(req.query.page) - 1) * req.query.limit;
        if (errors) {
            res.status(HttpStatus.BAD_REQUEST).json(errors);
            return;
        }
        else {
            models_1.default.FriendsList.findAll({
                where: {
                    user: req.user.id
                },
                attributes: {
                    exclude: ['user']
                },
                include: [{ model: models_1.default.User }]
            }).then(data => {
                res.status(HttpStatus.OK).json(data);
            });
        }
    }
    deletarAmigo(req, res) {
        req.checkBody("amigo_id").exists().notEmpty();
        var errors = req.validationErrors();
        if (errors) {
            res.status(HttpStatus.BAD_REQUEST).json(errors);
            return;
        }
        else {
            models_1.default.FriendsList.find({
                where: { user: req.user.id, friend: req.body.amigo_id }
            }).then(friend => {
                if (friend) {
                    models_1.default.sequelize.transaction((t) => {
                        return friend.destroy({ transaction: t }).then(data => {
                            models_1.default.FriendsList.find({
                                where: { user: req.body.amigo_id, friend: req.user.id }
                            }).then(friend2 => {
                                friend2.destroy();
                            });
                        }).then(deleted => {
                            res.status(HttpStatus.OK).json({ error: false, mensagem: "Amizade desfeita com sucesso" });
                            return;
                        }).catch(error => {
                            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: true, mensagem: "Ocorreu um erro ao deletar este usuário" });
                            return;
                        });
                    });
                }
                else {
                    res.status(HttpStatus.OK).json({ error: true, mensagem: "Essa amizade não existe!!!" });
                    return;
                }
            });
        }
    }
}
exports.default = new FriendListController();
