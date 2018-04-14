"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const Models_1 = require("./Models");
const http = require("http");
const utils_1 = require("./utils/utils");
const argv = require('yargs').argv;
const env = process.env.NODE_ENV || 'development';
const server = http.createServer(app_1.default);
const port = utils_1.normalizePort(process.env.port || 3000);
//Delete All Tabled and Create Again | Only for Development
let deleteTables = env.trim() === 'development' ? true : false;
Models_1.default.sequelize.sync({ force: deleteTables })
    .then(() => {
    server.listen(port);
    server.on('error', utils_1.onError(server));
    server.on('listening', utils_1.onListening(server));
});
