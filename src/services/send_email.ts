import Mail from '../services/mail';

export default class EnviarEmail {
    public static cadastro(email: string, name: string, token: string): void {

        Mail.to = email;
        Mail.subject = "Confirmar Email";
        Mail.message = `
        <html>
            <head>
                <title>River - Confirmar Email</title>
            </head>
            <BODY>
                <p></p>
                <p>Seja Bem vindo ${name} ao River</p><br><br>
                Confirme seu email <a href="http://www.riverapp.com.br/email?q=${token}">clicando aqui</a></p>
                <br><br>       
                <p>Dúvidas entre em  <a href="mailto:contato@lista_compra.com.br?Subject=Contato">contato conosco</a></p>         
                <footer>Se você não se cadastrou no River, por favor entre em <a href="http://www.riverapp.com.br/faleconosco">contato conosco</a></footer>
            </BODY>
        </html>
    `;

        Mail.sendMail();
    }

    public static recuperarSenha(email: string, name: string, token: string): void {
        Mail.to = email;
        Mail.subject = "Recuperação de Senha";
        Mail.message = `
        <html>
            <head>
                <title>River - Recuperar Senha</title>
            </head>
            <BODY>
                <p></p>
                <p>Olá ${name} parece que você esqueceu sua senha</p><br><br>
                Recupere sua senha <a href="http://www.riverapp.com.br/reset-password?q=${token}">clicando aqui</a></p>
                <br><br>       
                <p>Dúvidas entre em  <a href="mailto:contato@lista_compra.com.br?Subject=Contato">contato conosco</a></p>         
                <footer>Se você não se cadastrou no River, por favor entre em <a href="http://www.riverapp.com.br/faleconosco">contato conosco</a></footer>
            </BODY>
        </html>
    `;

        Mail.sendMail();
    }
}