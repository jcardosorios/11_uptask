import fs from 'fs';
import path from 'path';
import { transporter } from "../config/nodemailer"

interface IEmail {
    email: string
    name: string
    token: string
}

export class AuthEmail {
    static sendConfirmationEmail = async (user : IEmail) => {

        // Read the HTML template file
        const templatePath = path.join(__dirname, '../templates/emailConfirmation.html');
        const emailTemplate = fs.readFileSync(templatePath, 'utf8');

        const customizedHtml = emailTemplate
            .replace('{{name}}', user.name)
            .replace('{{token}}', user.token);

        const info = await transporter.sendMail({
            from: 'UpTask <admin@uptask.com>',
            to: user.email,
            subject: 'Uptask - Confirm your account',
            text: 'Uptask - Confirm your account',
            html: customizedHtml
        })

        console.log('Email sent', info.messageId)
    }
}