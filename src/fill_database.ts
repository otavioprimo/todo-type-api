import { TaskAttributes } from './models/TasksModel';
import { UserAttributes } from './models/UserModel';
import db from './models';

export class FillDatabase {
    fill(): void {

        db.User.create({
            name: 'Otávio Primo',
            email: 'otavioprimo@gmail.com',
            username: 'otavioprimo',
            password: '5886630'
        }).then(data => console.log(data));


        db.Task.create({
            title: "Sasad",
            message: "Description Sasad Teste",
            user: 1
        });
    }
}