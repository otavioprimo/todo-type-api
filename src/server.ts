import { FillDatabase } from './fill_database';
import app from "./app";
import db from './models';

import * as http from 'http';

import { normalizePort, onError, onListening } from './utils/utils';
import { Transaction } from 'sequelize';

const env: string = process.env.NODE_ENV || 'development';
const server = http.createServer(app);
const port = normalizePort(process.env.port || 3000);

//Delete All Tabled and Create Again | Only for Development
// let deleteTables = env.trim() === 'development' ? true : false;

db.sequelize.sync({ force: false })
    .then(() => {
        server.listen(port);
        server.on('error', onError(server));

        server.on('listening', onListening(server));
    });