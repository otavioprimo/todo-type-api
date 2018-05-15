"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authRoute_1 = require("../authRoute");
const express_1 = require("express");
const friend_invitation_controller_1 = require("./friend_invitation.controller");
const router = express_1.Router();
router.get('/pendentes', authRoute_1.default, friend_invitation_controller_1.default.convitesPendentes);
router.post('/pedido-amigo', authRoute_1.default, friend_invitation_controller_1.default.enviarConvite);
router.post('/aceitar-recusar', authRoute_1.default, friend_invitation_controller_1.default.aceitarRecusarConvite);
exports.default = router;
