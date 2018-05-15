"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const validator = require("express-validator");
const fileUpload = require("express-fileupload");
const morgan = require("morgan");
const path = require("path");
const mkdirp = require("mkdirp");
const auth_1 = require("./config/auth");
const user_routes_1 = require("./resources/user/user.routes");
const friend_invitation_routes_1 = require("./resources/friend_invitation/friend_invitation.routes");
const friend_list_routes_1 = require("./resources/friend_list/friend_list.routes");
const tasks_routes_1 = require("./resources/tasks/tasks.routes");
class App {
    constructor() {
        this.app = express();
        this.middleware();
        this.routes();
    }
    middleware() {
        this.app.all('/*', (req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
            next();
        });
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());
        this.app.use(cors());
        this.app.use(validator());
        this.app.use(morgan('dev'));
        this.app.use(fileUpload());
        this.app.use(auth_1.default);
    }
    routes() {
        mkdirp('./public/user/avatar', (err) => { });
        this.app.use('/static', express.static(path.join(__dirname, '../public')));
        this.app.use('/hello', (req, res) => { res.send("Olá Marilene"); });
        this.app.use('/v1/user', user_routes_1.default);
        this.app.use('/v1/invite', friend_invitation_routes_1.default);
        this.app.use('/v1/friend-list', friend_list_routes_1.default);
        this.app.use('/v1/task', tasks_routes_1.default);
    }
}
exports.default = new App().app;
