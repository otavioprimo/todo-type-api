import { TaskAttributes } from './models/TasksModel';
import { UserAttributes } from './models/UserModel';
import db from './models';
import { Transaction } from 'sequelize';

export class FillDatabase {
    static fill(): void {
        let users: UserAttributes[] = [
            {
                name: 'Otávio Primo',
                email: 'otavioprimo@gmail.com',
                username: 'otavioprimo',
                password: '5886630'
            },
            {
                name: 'Perera',
                email: 'perera@gmail.com',
                username: 'perera',
                password: '5886630'
            }
        ];

        let tasks: TaskAttributes[] = [
            {
                title: "Sasad",
                message: "Description Sasad Teste",
                user: 1,
                friend: 2
            },
            {
                title: "Sasad",
                message: "Description Sasad Teste",
                user: 2,
                friend: 1
            }
        ]

        users.forEach(element => {
            db.sequelize.transaction((t: Transaction) => {
                return db.User.create(element, { transaction: t });
            })
        });

        tasks.forEach(element => {
            db.sequelize.transaction((e: Transaction) => {
                return db.Task.create(element, { transaction: e });
            });
        });
    }
}