import type {Request, Response} from 'express'

import { handleError } from '../utils/errors'
import User from '../models/User'
import { hashPassword } from '../utils/auth'
import Token from '../models/Token'
import { generateToken } from '../utils/token'
import { transporter } from '../config/nodemailer'
import { AuthEmail } from '../emails/AuthEmail'

export class AuthController {
    static createAccount = async (req : Request ,res: Response)  => {
        try {
            const { password, email } = req.body

            // Prevent duplicated
            const userExist = await User.findOne({email})
            if(userExist){
                const error = new Error('User already exist')
                res.status(409).json([error.message])
            }
            
            // Create a user
            const user = new User(req.body)

            // Hash password
            user.password = await hashPassword(password)

            // Generate token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            // Send email
            await AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })
            
            //Save new user
            await Promise.allSettled([user.save(), token.save()])
            res.send('Account succesfully created, confirm your email to login')

        } catch (error) {
            handleError(res, error, "Failed to create the account")
        }
        
    }

    static confirmAccount = async (req : Request ,res: Response)  => {
        try {
            const { token } = req.body
            // Validate token exist
            const tokenExist = await Token.findOne({ token })

            if(!tokenExist){
                const error = new Error('Invalid token')
                res.status(401).json([error.message])
                return 
            }

            // If token is valid
            const user = await User.findById(tokenExist.user)
            user.confirmed = true

            await Promise.allSettled([user.save(), tokenExist.deleteOne()])

            res.send('Account confirmed, you can login now')
        } catch(error) {
            handleError(res, error, "Failed to confirm the account")
        }
    }
}