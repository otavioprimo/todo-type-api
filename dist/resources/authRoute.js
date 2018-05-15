"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function tokenRequired(req, res, next) {
    if (req.user) {
        next();
    }
    else {
        return res.status(401).json({ mensagem: 'Usuário não autorizado' });
    }
}
exports.default = tokenRequired;
