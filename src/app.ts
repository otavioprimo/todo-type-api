import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as validator from 'express-validator';
import * as  fileUpload from 'express-fileupload';
import * as morgan from 'morgan';
import * as path from 'path';
import * as mkdirp from 'mkdirp';

import db from './models';
import Mail from './services/mail';
import userRoute from './resources/user/user.routes';
import auth from './config/auth';
class App {

    public app: express.Application;

    constructor() {
        this.app = express();
        this.middleware();
        this.routes();
    }

    private middleware(): void {
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
        this.app.use(auth);
    }

    private routes() {
        mkdirp('./public/user/avatar', (err) => { });

        this.app.use('/static', express.static(path.join(__dirname, '../public')));
        this.app.use('/hello', (req, res) => { res.send("Olá Marilene") });
        this.app.use('/api/v1/user', userRoute);
    }
}

export default new App().app;