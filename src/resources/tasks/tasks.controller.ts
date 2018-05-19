import { ITask } from './tasks.interface';
import { ModelsInterface } from './../../interfaces/ModelsInterface';
import { Op, Transaction } from 'sequelize';

import * as HttpStatus from 'http-status-codes';

import db from '../../models';
import { TaskAttributes, TaskInstance } from '../../models/TasksModel';
import { TaskCheckListInstance, TaskCheckListAttributes } from '../../models/TaskCheckListModel';

class TasksController implements ITask {
    adicionar(req: any, res: any): void {
        req.checkBody("amigo_id").exists();
        req.checkBody("titulo").exists().notEmpty();
        req.checkBody("descricao").exists().notEmpty();
        req.checkBody("expiracao").exists();
        req.checkBody("array_lista").exists();

        var errors = req.validationErrors();

        if (errors) {
            res.status(HttpStatus.BAD_REQUEST).json(errors);
            return;
        } else {
            db.sequelize.transaction((t: Transaction) => {
                return db.Task.create({
                    user: req.user.id,
                    title: req.body.titulo,
                    message: req.body.descricao,
                    expiration: req.body.expiracao,
                    friend: req.body.amigo_id
                }, { transaction: t });
            }).then((task: TaskAttributes) => {
                //Se possuir uma lista, salva ela
                if (req.body.array_lista.length > 0) {
                    let lista = req.body.array_lista;
                    lista.forEach(element => {
                        db.TaskCheckList.create({
                            description: element.descricao,
                            task: task.id
                        });
                    });
                }
                res.status(HttpStatus.OK).json({ error: false, mensagem: "Tarefa criada com sucesso" });
            }).catch(err => {
                console.log(err);
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: true, mensagem: "Falha ao criar a tarefa" });
            });

        }
    }
    alterar(req: any, res: any): void {
        req.checkBody("id").exists().notEmpty();
        req.checkBody("titulo").exists().notEmpty();
        req.checkBody("descricao").exists().notEmpty();
        req.checkBody("expiracao").exists();

        var errors = req.validationErrors();

        if (errors) {
            res.status(HttpStatus.BAD_REQUEST).json(errors);
            return;
        } else {
            db.Task.findById(req.params.id)
                .then((task: TaskInstance) => {
                    db.sequelize.transaction((t: Transaction) => {
                        return task.update({
                            titulo: req.body.titulo,
                            descricao: req.body.descricao,
                            expiracao: req.body.expiracao
                        }, { transaction: t });
                    }).then((data: TaskInstance) => {
                        res.status(HttpStatus.OK).json({ error: false, mensagem: "Tarefa atualizada com sucesso" });
                    }).catch(err => {
                        console.log(err);
                        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: true, mensagem: "Falha ao atualizar a tarefa" });
                    });
                });
        }
    }

    alterarLista(req, res): void {
        req.checkBody("descricao").exists().notEmpty();

        var errors = req.validationErrors();

        if (errors) {
            res.status(HttpStatus.BAD_REQUEST).json(errors);
            return;
        } else {
            db.TaskCheckList.findById(req.params.id)
                .then((taskList: TaskCheckListInstance) => {
                    db.sequelize.transaction((t: Transaction) => {
                        return taskList.update({
                            description: req.body.descricao
                        });
                    }).then(data => {
                        res.status(HttpStatus.OK).json({ error: false, mensagem: "Lista da tarefa atualizada com sucesso" });
                    }).catch(err => {
                        console.log(err);
                        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: true, mensagem: "Falha ao atualizar a lista da tarefa" });
                    });
                });
        }
    }

    checkLista(req, res): void {
        req.checkBody("value").exists().notEmpty();

        var errors = req.validationErrors();

        if (errors) {
            res.status(HttpStatus.BAD_REQUEST).json(errors);
            return;
        } else {
            db.TaskCheckList.findById(req.params.id)
                .then((taskList: TaskCheckListInstance) => {
                    db.sequelize.transaction((t: Transaction) => {
                        return taskList.update({
                            check: req.body.value
                        });
                    }).then(data => {
                        res.status(HttpStatus.OK).json({ error: false, mensagem: "Lista da tarefa atualizada com sucesso" });
                    }).catch(err => {
                        console.log(err);
                        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: true, mensagem: "Falha ao atualizar a lista da tarefa" });
                    });
                });
        }
    }

    deletar(req: any, res: any): void {
        db.Task.findById(req.params.id)
            .then((task: TaskInstance) => {
                if (task) {
                    db.sequelize.transaction((t: Transaction) => {
                        db.TaskCheckList.destroy({ where: { task: req.params.id } });
                        return task.destroy();
                    }).then(data => {
                        res.status(HttpStatus.OK).json({ error: false, mensagem: "Tarefa deletada com sucesso" });
                    }).catch(err => {
                        console.log(err);
                        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: true, mensagem: "Falha ao deletar a tarefa" });
                    })
                } else {
                    res.status(HttpStatus.NOT_FOUND).json({ error: true, mensagem: "Tarefa não encontrada" });
                }
            }).catch(err => {
                console.log(err);
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: true, mensagem: "Falha ao encontrar a tarefa" });
            })
    }

    deletarItemLista(req: any, res: any): void {
        db.TaskCheckList.findById(req.params.id)
            .then((task: TaskCheckListAttributes) => {
                if (task) {
                    db.sequelize.transaction((t: Transaction) => {
                        return db.TaskCheckList.destroy({ where: { id: req.params.id } });
                    }).then(data => {
                        res.status(HttpStatus.OK).json({ error: false, mensagem: "Item deletado com sucesso" });
                    }).catch(err => {
                        console.log(err);
                        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: true, mensagem: "Falha ao deletar o item" });
                    })
                } else {
                    res.status(HttpStatus.NOT_FOUND).json({ error: true, mensagem: "Item não encontrado" });
                }
            }).catch(err => {
                console.log(err);
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: true, mensagem: "Falha ao encontrar o item" });
            })
    }

    buscarTodas(req: any, res: any): void {
        req.checkQuery("page").exists().notEmpty();
        req.checkQuery("limit").exists().notEmpty();
        var errors = req.validationErrors();

        let offset = (Number(req.query.page) - 1) * req.query.limit;

        if (errors) {
            res.status(HttpStatus.BAD_REQUEST).json(errors);
            return;
        } else {
            db.Task.findAll({
                where: { user: req.user.id, status: true },
                attributes: { exclude: ["user", "friend"] },
                order: [['createdAt', 'DESC']],
                offset: Number(offset),
                limit: Number(req.query.limit),
                include: [{ model: db.User, required: false }]
            })
                .then(data => {
                    res.status(HttpStatus.OK).json(data);
                });
        }
    }

    buscarPorId(req: any, res: any): void {
        db.Task.findById(req.params.id, {
            attributes: { exclude: ["user"] },
            order: [['createdAt', 'DESC']],
            include: [{ model: db.User }]
        })
            .then(data => {
                db.TaskCheckList.findAll({ where: { task: data.id } })
                    .then(list => {
                        let response: any = data.toJSON();
                        response.list = list;
                        res.status(HttpStatus.OK).json(response);
                    });
            });
    }
    buscarDesignadasParaUsuario(req: any, res: any): void {
        req.checkQuery("page").exists().notEmpty();
        req.checkQuery("limit").exists().notEmpty();
        var errors = req.validationErrors();

        let offset = (Number(req.query.page) - 1) * req.query.limit;

        if (errors) {
            res.status(HttpStatus.BAD_REQUEST).json(errors);
            return;
        } else {
            // db.sequelize.query(`
            // select a.id,a.title,a.message,a.shared_token,a.public_id,a.expiration,a.createdAt,
            //     a.user,b.name,b.photo_url,b.username
            // from tasks a
            // left join users b ON a.user = b.id
            // where a.friend = ${req.user.id}
            // limit ${req.query.limit}
            // offset ${offset};`,
            //     { model: db.Task })
            //     .then(data => {
            //         res.send(data);
            //     });

            db.Task.findAll({
                where: {
                    friend: req.user.id
                },
                attributes: {
                    exclude: ["friend", "user"],
                    include: [['user', 'owner']]
                },
                order: [
                    ['createdAt', 'DESC']
                ],
                offset: Number(offset),
                limit: Number(req.query.limit),
                include: [{ model: db.User }]
            })
                .then(data => {
                    res.status(HttpStatus.OK).json(data);
                });
        }
    }
    buscarDesignadasPeloUsuario(req: any, res: any): void {
        req.checkQuery("page").exists().notEmpty();
        req.checkQuery("limit").exists().notEmpty();
        var errors = req.validationErrors();

        let offset = (Number(req.query.page) - 1) * req.query.limit;

        if (errors) {
            res.status(HttpStatus.BAD_REQUEST).json(errors);
            return;
        } else {
            db.Task.findAll({
                where: {
                    user: req.user.id,
                    status: true,
                    friend: { [Op.ne]: null }
                },
                attributes: {
                    exclude: ["user", "friend"]
                },
                order: [
                    ['createdAt', 'DESC']
                ],
                offset: Number(offset),
                limit: Number(req.query.limit),
                include: [{ model: db.User }]
            })
                .then(data => {
                    res.status(HttpStatus.OK).json(data);
                });
        }
    }
}

export default new TasksController();