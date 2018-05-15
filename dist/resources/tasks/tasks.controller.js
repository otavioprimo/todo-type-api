"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const HttpStatus = require("http-status-codes");
const models_1 = require("../../models");
class TasksController {
    adicionar(req, res) {
        req.checkBody("amigo_id").exists();
        req.checkBody("titulo").exists().notEmpty();
        req.checkBody("descricao").exists().notEmpty();
        req.checkBody("expiracao").exists();
        req.checkBody("array_lista").exists();
        var errors = req.validationErrors();
        if (errors) {
            res.status(HttpStatus.BAD_REQUEST).json(errors);
            return;
        }
        else {
            models_1.default.sequelize.transaction((t) => {
                return models_1.default.Task.create({
                    user: req.user.id,
                    title: req.body.titulo,
                    message: req.body.descricao,
                    expiration: req.body.expiracao,
                    friend: req.body.amigo_id
                }, { transaction: t });
            }).then((task) => {
                //Se possuir uma lista, salva ela
                if (req.body.array_lista.length > 0) {
                    let lista = req.body.array_lista;
                    lista.forEach(element => {
                        models_1.default.TaskCheckList.create({
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
    alterar(req, res) {
        req.checkBody("id").exists().notEmpty();
        req.checkBody("titulo").exists().notEmpty();
        req.checkBody("descricao").exists().notEmpty();
        req.checkBody("expiracao").exists();
        var errors = req.validationErrors();
        if (errors) {
            res.status(HttpStatus.BAD_REQUEST).json(errors);
            return;
        }
        else {
            models_1.default.Task.findById(req.params.id)
                .then((task) => {
                models_1.default.sequelize.transaction((t) => {
                    return task.update({
                        titulo: req.body.titulo,
                        descricao: req.body.descricao,
                        expiracao: req.body.expiracao
                    }, { transaction: t });
                }).then((data) => {
                    res.status(HttpStatus.OK).json({ error: false, mensagem: "Tarefa atualizada com sucesso" });
                }).catch(err => {
                    console.log(err);
                    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: true, mensagem: "Falha ao atualizar a tarefa" });
                });
            });
        }
    }
    alterarLista(req, res) {
        req.checkBody("descricao").exists().notEmpty();
        var errors = req.validationErrors();
        if (errors) {
            res.status(HttpStatus.BAD_REQUEST).json(errors);
            return;
        }
        else {
            models_1.default.TaskCheckList.findById(req.params.id)
                .then((taskList) => {
                models_1.default.sequelize.transaction((t) => {
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
    checkLista(req, res) {
        req.checkBody("value").exists().notEmpty();
        var errors = req.validationErrors();
        if (errors) {
            res.status(HttpStatus.BAD_REQUEST).json(errors);
            return;
        }
        else {
            models_1.default.TaskCheckList.findById(req.params.id)
                .then((taskList) => {
                models_1.default.sequelize.transaction((t) => {
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
    deletar(req, res) {
        models_1.default.Task.findById(req.params.id)
            .then((task) => {
            if (task) {
                models_1.default.sequelize.transaction((t) => {
                    models_1.default.TaskCheckList.destroy({ where: { task: req.params.id } });
                    return task.destroy();
                }).then(data => {
                    res.status(HttpStatus.OK).json({ error: false, mensagem: "Tarefa deletada com sucesso" });
                }).catch(err => {
                    console.log(err);
                    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: true, mensagem: "Falha ao deletar a tarefa" });
                });
            }
            else {
                res.status(HttpStatus.NOT_FOUND).json({ error: true, mensagem: "Tarefa não encontrada" });
            }
        }).catch(err => {
            console.log(err);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: true, mensagem: "Falha ao encontrar a tarefa" });
        });
    }
    buscarTodas(req, res) {
        req.checkQuery("page").exists().notEmpty();
        req.checkQuery("limit").exists().notEmpty();
        var errors = req.validationErrors();
        let offset = (Number(req.query.page) - 1) * req.query.limit;
        if (errors) {
            res.status(HttpStatus.BAD_REQUEST).json(errors);
            return;
        }
        else {
            models_1.default.Task.findAll({
                where: {
                    user: req.user.id,
                    status: true
                },
                attributes: {
                    exclude: ["user", "friend"]
                },
                order: [
                    ['createdAt', 'DESC']
                ],
                offset: Number(offset),
                limit: Number(req.query.limit),
                include: [{ model: models_1.default.User }]
            })
                .then(data => {
                res.status(HttpStatus.OK).json(data);
            });
        }
    }
    buscarPorId(req, res) {
        models_1.default.Task.findById(req.params.id, {
            attributes: {
                exclude: ["user"]
            },
            order: [
                ['createdAt', 'DESC']
            ],
            include: [{ model: models_1.default.User }]
        })
            .then(data => {
            res.status(HttpStatus.OK).json(data);
        });
    }
    buscarDesignadasParaUsuario(req, res) {
        req.checkQuery("page").exists().notEmpty();
        req.checkQuery("limit").exists().notEmpty();
        var errors = req.validationErrors();
        let offset = (Number(req.query.page) - 1) * req.query.limit;
        if (errors) {
            res.status(HttpStatus.BAD_REQUEST).json(errors);
            return;
        }
        else {
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
            models_1.default.Task.findAll({
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
                include: [{ model: models_1.default.User }]
            })
                .then(data => {
                res.status(HttpStatus.OK).json(data);
            });
        }
    }
    buscarDesignadasPeloUsuario(req, res) {
        req.checkQuery("page").exists().notEmpty();
        req.checkQuery("limit").exists().notEmpty();
        var errors = req.validationErrors();
        let offset = (Number(req.query.page) - 1) * req.query.limit;
        if (errors) {
            res.status(HttpStatus.BAD_REQUEST).json(errors);
            return;
        }
        else {
            models_1.default.Task.findAll({
                where: {
                    user: req.user.id,
                    status: true,
                    friend: { [sequelize_1.Op.ne]: null }
                },
                attributes: {
                    exclude: ["user", "friend"]
                },
                order: [
                    ['createdAt', 'DESC']
                ],
                offset: Number(offset),
                limit: Number(req.query.limit),
                include: [{ model: models_1.default.User }]
            })
                .then(data => {
                res.status(HttpStatus.OK).json(data);
            });
        }
    }
}
exports.default = new TasksController();
