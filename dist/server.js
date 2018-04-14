"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const http = require("http");
const utils_1 = require("./utils/utils");
const argv = require('yargs').argv;
const env = process.env.NODE_ENV || 'development';
const server = http.createServer(app_1.default);
const port = utils_1.normalizePort(process.env.port || 3000);
let force = env.trim() === 'development' ? true : false;
console.log("force", force);
// db.sequelize.sync({ force: true })
// .then(() => {
// server.listen(port);
// server.on('error', onError(server));
// server.on('listening', onListening(server));
// });
