"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const validator = require("express-validator");
const morgan = require("morgan");
const user_routes_1 = require("./resources/user/user.routes");
const auth_1 = require("./config/auth");
class App {
    constructor() {
        this.app = express();
        this.middleware();
        this.routes();
    }
    middleware() {
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());
        this.app.use(cors());
        this.app.use(validator());
        this.app.use(morgan('dev'));
        this.app.use(auth_1.default);
    }
    routes() {
        this.app.use('/hello', (req, res) => { res.send("Olá Marilene"); });
        this.app.use('/api/v1/user', user_routes_1.default);
    }
}
exports.default = new App().app;
