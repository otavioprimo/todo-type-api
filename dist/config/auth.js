"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const default_variables_1 = require("./default_variables");
const jwt = require("jsonwebtoken");
const HttpStatus = require("http-status-codes");
function auth(req, res, next) {
    var token = req.headers['authorization'];
    if (token) {
        jwt.verify(token, default_variables_1.default.jwt_token, (err, decoded) => {
            if (err) {
                return res.status(HttpStatus.UNAUTHORIZED).json({ error: true, mensagem: "Token inválido" });
            }
            else {
                req.user = decoded;
                next();
            }
        });
    }
    else {
        req = Object.assign({ user: undefined }, req);
        next();
    }
}
exports.default = auth;
