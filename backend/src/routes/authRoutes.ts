import { Router } from 'express'
import { body, param } from 'express-validator'
import { AuthController } from '../controllers/AuthController'
import { handleInputErrors } from '../middleware/validation'
import { tokenExist, checkUserNotConfirmed, userExist, validatePassword, checkUserConfirmed } from '../middleware/auth'

const router = Router()

// Create Account
router.post('/create-account',
    // Validation
    body('name')
        .notEmpty().withMessage('Name is required'),
    body('password')
        .isLength({ min: 8}).withMessage('Password must be at least 8 characters long'),
    body('password_confirmation').custom((value, { req }) => {
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
    tokenExist,
    AuthController.confirmAccount
)

// Login Account
router.post('/login',
    body('email')
        .isEmail().withMessage('Email must be valid'),
    body('password')
        .notEmpty().withMessage('Password is required'),
    handleInputErrors,
    userExist,
    checkUserNotConfirmed,
    validatePassword,
    AuthController.loginAccount
)

// Resend confirmation code
router.post('/request-code',
    body('email')
        .isEmail().withMessage('Email must be valid'),
    handleInputErrors,
    userExist,
    checkUserConfirmed,
    AuthController.requestConfirmationCode
)

// Forgot password
router.post('/forgot-password',
    body('email')
        .isEmail().withMessage('Email must be valid'),
    handleInputErrors,
    userExist,
    AuthController.forgotPassword
)

// Confirm token New password
router.post('/validate-token',
    body('token')
        .notEmpty().withMessage('Token is required'),
    handleInputErrors,
    tokenExist,
    AuthController.validateToken
)

// Resrt password
router.post('/reset-password/:token',
    param('token')
        .notEmpty().withMessage('Token is required'),
    body('password')
        .isLength({ min: 8}).withMessage('Password must be at least 8 characters long'),
    body('password_confirmation').custom((value, { req }) => {
        if(value !== req.body.password){
            throw new Error('Passwords do not match')
        }
        return true
    }),
    handleInputErrors,
    tokenExist,
    AuthController.resetPasswordWithToken
)

export default router