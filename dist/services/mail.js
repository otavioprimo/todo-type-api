"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = require("nodemailer");
const mail_config_1 = require("./../config/mail.config");
class Mail {
    constructor(to, subject, message) {
        this.to = to;
        this.subject = subject;
        this.message = message;
    }
    sendMail() {
        let mailOptions = {
            from: "callofbreja@gmail.com",
            to: this.to,
            subject: this.subject,
            html: this.message
        };
        const transporter = nodemailer.createTransport({
            host: mail_config_1.default.host,
            port: mail_config_1.default.port,
            secure: false,
            auth: {
                user: mail_config_1.default.user,
                pass: mail_config_1.default.password
            },
            tls: { rejectUnauthorized: false }
        });
        // console.log(mailOptions);
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return error;
            }
            else {
                return "E-mail enviado com sucesso!";
            }
        });
    }
}
exports.default = new Mail;
