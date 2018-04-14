"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_controllers_1 = require("./user.controllers");
const express_1 = require("express");
const router = express_1.Router();
router.get('/', user_controllers_1.default.testeEmail);
exports.default = router;
