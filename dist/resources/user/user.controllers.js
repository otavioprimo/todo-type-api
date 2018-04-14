"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserController {
    testeEmail(req, res) {
        // req.checkQuery("email").exists().isEmail();
        // var errors = req.validationErrors();
        // if (errors) {
        //     res.status(HttpStatus.BAD_REQUEST).json(errors);
        //     return;
        // } else {
        //     Mail.to = req.query.email;
        //     Mail.subject = 'sasad';
        //     Mail.message = 'Body sasad';
        //     let result = Mail.sendMail();
        //     res.status(HttpStatus.OK).json({ error: false, message: 'enviado' })
        // }
    }
}
exports.default = new UserController();
