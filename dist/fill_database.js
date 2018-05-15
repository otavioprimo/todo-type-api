"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("./models");
class FillDatabase {
    fill() {
        models_1.default.User.create({
            name: 'Otávio Primo',
            email: 'otavioprimo@gmail.com',
            username: 'otavioprimo',
            password: '5886630'
        }).then(data => console.log(data));
        models_1.default.Task.create({
            title: "Sasad",
            message: "Description Sasad Teste",
            user: 1
        });
    }
}
exports.FillDatabase = FillDatabase;
