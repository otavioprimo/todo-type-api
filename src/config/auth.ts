import { Request, Response, NextFunction } from 'express';
import default_configs from "./default_variables";
import * as jwt from 'jsonwebtoken';
import * as HttpStatus from 'http-status-codes';


function auth(req, res, next) {
    var token = req.headers['authorization'];

    if (token) {
        jwt.verify(token, default_configs.jwt_token, (err, decoded) => {
            if (err) {
                return res.status(HttpStatus.UNAUTHORIZED).json({ error: true, mensagem: "Token inválido" });
            } else {
                req.user = decoded;
                next();
            }
        })
    } else {
        req = Object.assign({ user: undefined }, req);
        next();
    }
}

export default auth;
