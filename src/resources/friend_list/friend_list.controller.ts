import { ModelsInterface } from './../../interfaces/ModelsInterface';
import * as HttpStatus from 'http-status-codes';
import { Op, Transaction } from 'sequelize';

import db from '../../models';
import { IFriendList } from './friend_list_interface';

class FriendListController implements IFriendList {
    buscarAmigos(req: any, res: any): void {
        req.checkQuery("page").exists().notEmpty();
        req.checkQuery("limit").exists().notEmpty();
        var errors = req.validationErrors();

        let offset = (Number(req.query.page) - 1) * req.query.limit;

        if (errors) {
            res.status(HttpStatus.BAD_REQUEST).json(errors);
            return;
        } else {
            db.FriendsList.findAll({
                where: {
                    user: req.user.id
                },
                attributes: {
                    exclude: ['user']
                },
                include: [{ model: db.User }]
            }).then(data => {
                res.status(HttpStatus.OK).json(data);
            });
        }
    }
    deletarAmigo(req: any, res: any): void {
        req.checkBody("amigo_id").exists().notEmpty();
        var errors = req.validationErrors();

        if (errors) {
            res.status(HttpStatus.BAD_REQUEST).json(errors);
            return;
        } else {
            db.FriendsList.find({
                where: { user: req.user.id, friend: req.body.amigo_id }
            }).then(friend => {
                if (friend) {
                    db.sequelize.transaction((t: Transaction) => {
                        return friend.destroy({ transaction: t }).then(data => {
                            db.FriendsList.find({
                                where: { user: req.body.amigo_id, friend: req.user.id }
                            }).then(friend2 => {
                                friend2.destroy();
                            })
                        }).then(deleted => {
                            res.status(HttpStatus.OK).json({ error: false, mensagem: "Amizade desfeita com sucesso" });
                            return;
                        }).catch(error => {
                            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: true, mensagem: "Ocorreu um erro ao deletar este usuário" });
                            return;
                        })
                    });
                } else {
                    res.status(HttpStatus.OK).json({ error: true, mensagem: "Essa amizade não existe!!!" });
                    return;
                }
            });
        }
    }
}

export default new FriendListController();