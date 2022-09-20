const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const fs = require('fs');

const transporter = nodemailer.createTransport(
    sendgridTransport({
        auth: {
            api_key:
            ''
        }
    })
);

const excluirRelatorio = () => {
    try {
        fs.unlinkSync('./src/index.html');
        console.log('Arquivo excluído!');
    } catch (error) {
        console.log('Deu erro na exclusão do relatório HTML:', error);
    }
};

const enviaEmail = () => {
    transporter.sendMail({
        to: 'hudson1206@gmail.com',
        from: 'hudson.andrade@hotmail.com.br',
        subject: 'Teste de envio de email com Webscraping - onix',
        html: ({path: './src/index.html'})
    })
};

const main = async () => {
    await enviaEmail();
    await excluirRelatorio();
    console.log('email enviado!');
}

main();
