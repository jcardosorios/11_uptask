import fs from 'fs';
import path from 'path';
import { transporter } from "../config/nodemailer"

interface IEmail {
    email: string
    name: string
    token: string
}

export class AuthEmail {
    static async sendEmail(htmlEmail : string, email: string, subject: string){
        try {
            const info = await transporter.sendMail({
                from: 'UpTask <admin@uptask.com>',
                to: email,
                subject: subject,
                text: subject,
                html: htmlEmail
            })
    
            console.log('Email sent', info.messageId)
        } catch (error) {
            console.log(error)
        }
    }

    static sendConfirmationEmail = async (user : IEmail) => {

        // Read the HTML template file
        const templatePath = path.join(__dirname, './templates/emailConfirmation.html');
        console.log('Ruta del archivo:', __dirname);

        // Si quieres la ruta completa del archivo, puedes usar path.join
        const filePath = path.join(__dirname, 'AuthEmail.js');
        console.log('Ruta completa del archivo:', filePath);


        const emailTemplate = fs.readFileSync(templatePath, 'utf8');

        const url = `${process.env.FRONTEND_URL}/auth/confirm-account`
        const customizedHtml = emailTemplate
            .replace('{{name}}', user.name)
            .replace('{{token}}', user.token)
            .replace('{{link}}', url)

        await AuthEmail.sendEmail(customizedHtml, user.email, 'Uptask - Confirm your account')

    }

    static sendPasswordResetToken = async (user : IEmail) => {

        // Read the HTML template file
        const templatePath = path.join(__dirname, './templates/emailResetPassword.html');
        const emailTemplate = fs.readFileSync(templatePath, 'utf8');

        const url = `${process.env.FRONTEND_URL}/auth/reset-password`
        const customizedHtml = emailTemplate
            .replace('{{name}}', user.name)
            .replace('{{token}}', user.token)
            .replace('{{link}}', url)

        await AuthEmail.sendEmail(customizedHtml, user.email, 'Uptask - Reset your password')
    }
}