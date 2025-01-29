import type {Request, Response, NextFunction} from 'express'
import User, { IUser } from '../models/User'
import Token, { IToken } from '../models/Token'
import { generateToken } from '../utils/token'
import { AuthEmail } from '../emails/AuthEmail'
import { checkPassword } from '../utils/auth'

declare global {
    namespace Express {
        interface Request {
            user: IUser,
            token: IToken
        }
    }
}

export async function tokenExist(req: Request, res: Response, next: NextFunction){
    try {


        // Search existing token
        const token = await Token.findOne({ token : req.body.token })
        if (!token){
            res.status(404).json({errors: [{
                type: "field",
                value: token,
                msg: 'Token invalid',
                path: "token",
                location: "body"
            }]})
            return
        }
        req.token = token
        next()
    } catch (error) {
        next(error)
    }
}

export async function userExist(req: Request, res: Response, next: NextFunction){
    try {

        const { email } = req.body
        // Search existing user
        const user = await User.findOne({email})
        if (!user || user.isDeleted){
            res.status(404).json({errors: [{
                type: "field",
                value: email,
                msg: 'User not found',
                path: "email",
                location: "body"
            }]})
            return
        }
        req.user = user
        next()
    } catch (error) {
        next(error)
    }
}

export async function checkUserNotConfirmed(req: Request, res: Response, next: NextFunction){
    try {

        const { user } = req
        // Validate if user is confirmed
        if (!user.confirmed){
            // Create a new token      
            const token = new Token()
            token.user = user.id
            token.token = generateToken()
            await token.save()

            // Send email
            await AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            res.status(401).json({errors: [{
                msg: 'User not confirmed, we resend you a confirmation email',
            }]})
            return
        }

        next()
    } catch (error) {
        next(error)
    }
}

export async function checkUserConfirmed(req: Request, res: Response, next: NextFunction){
    try {

        const { user } = req
        // Validate if user is confirmed
        if (user.confirmed){

            res.status(403).json({errors: [{
                msg: 'User already confirmed',
            }]})
            return
        }

        next()
    } catch (error) {
        next(error)
    }
}


export async function validatePassword(req: Request, res: Response, next: NextFunction){
    try {
        const { password } = req.body
        const { user } = req
        const isPasswordCorrect = await checkPassword(password, user.password)
        
        console.log(user)
        console.log(isPasswordCorrect)
        // Validate if password is correct
        if (!isPasswordCorrect){
            res.status(401).json({errors: [{
                msg: 'Password Incorrect',
            }]})
            return
        }

        next()
    } catch (error) {
        next(error)
    }
}