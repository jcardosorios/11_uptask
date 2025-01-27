import { Router } from 'express'
import { body } from 'express-validator'
import { AuthController } from '../controllers/AuthController'
import { handleInputErrors } from '../middleware/validation'

const router = Router()

// Create Account
router.post('/create-account',
    // Validation
    body('name')
        .notEmpty().withMessage('Name is required'),
    body('password')
        .isLength({ min: 8}).withMessage('Password must be at least 8 characters long'),
    body('password-confirmation').custom((value, { req }) => {
        if(value !== req.body.password){
            throw new Error('Passwords do not match')
        }
        return true
    }),
    body('email')
        .isEmail().withMessage('Email must be valid'),
    handleInputErrors,
    AuthController.createAccount
)

// Confirm Account
router.post('/confirm-account',
    body('token')
        .notEmpty().withMessage('Token is required'),
    handleInputErrors,
    AuthController.confirmAccount
)

export default router