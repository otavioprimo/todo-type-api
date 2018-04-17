import Mail from '../services/mail';

export default class EnviarEmail {
    public static cadastro(email: string, name: string, token: string): void {

        Mail.to = email;
        Mail.subject = "Confirmar Email";
        Mail.message = `
        <html>
            <head>
                <title>Sasad - Confirmar Email</title>
            </head>
            <BODY>
                <p></p>
                <p>Seja Bem vindo ${name} ao Sasad</p><br><br>
                COnfirme seu email <a href="http://www.callofbreja.com.br/email?q=${token}">clicando aqui</a></p>
                <br><br>       
                <p>Dúvidas entre em  <a href="mailto:contato@lista_compra.com.br?Subject=Contato">contato conosco</a></p>         
                <footer>Se você não se cadastrou no Sasad, por favor entre em <a href="http://www.callofbreja.com.br/faleconosco">contato conosco</a></footer>
            </BODY>
        </html>
    `;

        Mail.sendMail();
    }
}