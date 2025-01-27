import type {Request, Response} from 'express'

import { handleError } from '../utils'
import User from '../models/User'
import { hashPassword } from '../utils/auth'

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
            
            //Save new user
            await user.save()
            res.send('Account succesfully created, confirm your email to login')

        } catch (error) {
            handleError(res, error, "Failed to create the task")
        }
        
    }
}