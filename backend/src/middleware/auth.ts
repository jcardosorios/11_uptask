import type {Request, Response, NextFunction} from 'express'
import User, { IUser } from '../models/User'
import Token, { IToken } from '../models/Token'
import { generateToken } from '../utils/token'
import { AuthEmail } from '../emails/AuthEmail'
import { checkPassword } from '../utils/auth'
import jwt from 'jsonwebtoken'

declare global {
    namespace Express {
        interface Request {
            user?: IUser,
            token?: IToken
        }
    }
}

// Validate that token existe
export async function tokenExist(req: Request, res: Response, next: NextFunction){
    try {


        // Search existing token
        const token = await Token.findOne({ token : req.body.token || req.params.token })
        if (!token){
            res.status(404).json({errors: [{
                type: "field",
                value: req.body.token || req.params.token,
                msg: 'Token invalid',
                path: "token",
                location: req.body.token ? "body" : "params"
            }]})
            return
        }
        req.token = token
        next()
    } catch (error) {
        next(error)
    }
}

// Validate that user not exist already
export async function validateUserExist(req: Request, res: Response, next: NextFunction){
    try {
        const { email } = req.body

        const userExist = await User.findOne({email})
        if(userExist){
            if(req.user && req.user.id.toString() === userExist.id.toString()) {
                next()
                return
            } else {
                const error = new Error('User already exist')
                res.status(409).json({ errors: [{msg : error.message}]})
                return
            }
        }
        next()
    } catch (error) {
        next(error)
    }
}

// Validate that user exist
export async function validateUser(req: Request, res: Response, next: NextFunction){
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

export async function validateUserShort(req: Request, res: Response, next: NextFunction){
    try {
        const { email } = req.body
        // Search existing user
        const user = await User.findOne({ $and : [
            { email },
            { isDeleted: false }
        ]}).select('id email name')
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

export async function validateUserByIdShort(req: Request, res: Response, next: NextFunction){
    try {
        const userId = req.params.userId || req.body.userId
        // Search existing user
        const user = await User.findOne({ $and : [
            { _id: userId },
            { isDeleted: false }
        ]}).select('id')
    
        if (!user){
            res.status(404).json({errors: [{
                type: "field",
                value: userId,
                msg: 'User not found',
                path: "id",
                location: req.body ? "body" : "params"
            }]})
            return
        }
        req.user = user
        next()
    } catch (error) {
        next(error)
    }
}


// Validate if user is not confirmed
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

// Validate if user is confirmed
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

// Validate password
export async function validatePassword(req: Request, res: Response, next: NextFunction){
    try {
        const { password } = req.body
        const { user } = req
        const isPasswordCorrect = await checkPassword(password, user.password)
        
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


// Validate JWT on headers
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization
    // Validate there is a bearer
    if(!bearer){
        res.status(401).json({errors: [{
            msg: 'Not authorized',
        }]})
        return
    }

    const [, token] = bearer.split(' ')

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if(typeof decoded === 'object' && decoded.id){
            const user = await User.findById(decoded.id).select('_id name email password')
            if(user) {
                req.user = user
                next()
            } else {
                res.status(401).json({
                    errors: [{
                        msg: 'Invalid or expired token',
                    }]
                });
            }
        }
    } catch (error) {
        res.status(401).json({
            errors: [{
                msg: 'Invalid or expired token',
            }]
        });
    }
}