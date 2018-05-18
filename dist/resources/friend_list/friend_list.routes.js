"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoute_1 = require("../authRoute");
const friend_list_controller_1 = require("./friend_list.controller");
const router = express_1.Router();
router.get('/', authRoute_1.default, friend_list_controller_1.default.buscarAmigos);
router.delete('/:amigo_id', authRoute_1.default, friend_list_controller_1.default.deletarAmigo);
exports.default = router;
