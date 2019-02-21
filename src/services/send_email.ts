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
                <p>Seja Bem vindo ${name} ao River</p><br>
                Confirme seu email <a href="http://www.riverapp.com.br/email?q=${token}">clicando aqui</a></p>
                <br><br>       
                <p>Dúvidas entre em  <a href="mailto:contato@riverapp.com.br?Subject=Contato">contato conosco</a></p>         
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
                <p>Olá ${name} parece que você esqueceu sua senha</p><br>
                Recupere sua senha <a href="http://www.riverapp.com.br/reset-password?q=${token}">clicando aqui</a></p>
                <br><br>       
                <p>Dúvidas entre em  <a href="mailto:contato@@riverapp.com.br?Subject=Contato">contato conosco</a></p>         
                <footer>Se você não se cadastrou no River, por favor entre em <a href="http://www.riverapp.com.br/faleconosco">contato conosco</a></footer>
            </BODY>
        </html>
    `;

        Mail.sendMail();
    }

    public static pedidoAmigo(email: string, nome_usuario: string, nome_amigo: String, foto: string, mensagem: string) {
        Mail.to = email;
        Mail.subject = "Recuperação de Senha";
        Mail.message = `
        <html>

        <head>
            <title>Call of Breja- Pedido de Amigo</title>
        </head>
        <style>
            #profile-avatar {
                width: 80px;
                border-radius: 50%;
            }
        
            #nome {
                display: inline-block;
                position: absolute !important   ;
                margin-left: 11px;
                font-size: 25px;
                margin-top: 0px;
            }
        
            #mensagem {
                display: inline-block;
                position: absolute !important;
                margin-top: 30px;
                margin-left: 11px;
                word-wrap: break-word;
                font-style: italic;
                width: 250px;
            }
        
            #btn-aceitar{
                background-color:rgb(0, 22, 150);
                color:#fff;
            }
        
            #btn-recusar{
                background-color: rgb(209, 0, 0);
                color:#fff;
            }
        
            .btn{
                width: 100px;
                height: 30px;
                border: none;
            }
        </style>
        
        <BODY>
            <p>`+ nome_usuario + `</p>
            <p>Você tem um novo pedido de amigo</p>
            <div>
                <img src="`+ foto + `" id="profile-avatar">
                <p id="nome">`+ nome_amigo + `</p>
                <p id="mensagem">`+ mensagem + `</p>
            </div>
            <br>
            <button id="btn-aceitar" class="btn">ACEITAR</button>
            <button id="btn-recusar" class="btn">RECUSAR</button>
            <br>
                <p>Dúvidas entre em  <a href="mailto:contato@@riverapp.com.br?Subject=Contato">contato conosco</a></p>         
            </p>
            <footer>Se você não solicitou a recuperação de senha, por favor entre em
                <a href="http://www.riverapp.com.br/faleconosco">contato conosco</a>
            </footer>
        </BODY>
        
        </html>
    `;

        Mail.sendMail();
    }
}