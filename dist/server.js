"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const models_1 = require("./models");
const http = require("http");
const utils_1 = require("./utils/utils");
const env = process.env.NODE_ENV || 'development';
const server = http.createServer(app_1.default);
const port = utils_1.normalizePort(process.env.port || 3000);
//Delete All Tabled and Create Again | Only for Development
let deleteTables = env.trim() === 'development' ? true : false;
models_1.default.sequelize.sync({ force: false })
    .then(() => {
    server.listen(port);
    server.on('error', utils_1.onError(server));
    server.on('listening', utils_1.onListening(server));
    // env.trim() === 'development' ? FillDatabase.fill() : "";
});
