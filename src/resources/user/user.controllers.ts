import { IUserController } from './user.interface';
import { Router, Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';

import Mail from '../../services/mail';

class UserController implements IUserController {

    public testeEmail(req: Request, res: Response): void {

        req.checkQuery("email").exists().isEmail();
        var errors = req.validationErrors();

        if (errors) {
            res.status(HttpStatus.BAD_REQUEST).json(errors);
            return;
        } else {
            Mail.to = req.query.email;
            Mail.subject = 'sasad';
            Mail.message = 'Body sasad';

            let result = Mail.sendMail();

            res.status(HttpStatus.OK).json({ error: false, message: 'enviado' })
        }
    }

}

export default new UserController();