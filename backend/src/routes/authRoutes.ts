import { Router } from 'express'
import { body, param } from 'express-validator'
import { AuthController } from '../controllers/AuthController'
import { handleInputErrors, validateCreateAccount, validateEmailInput, validateLoginInput, validatePasswordInput, validateProfileInput, validateResetPasswordInput, validateTokenInput } from '../middleware/validation'
import { tokenExist, checkUserNotConfirmed, validatePassword, checkUserConfirmed, authenticate, validateUser, validateUserExist } from '../middleware/auth'

const router = Router()

// Create Account
router.post('/create-account',
    validateCreateAccount,
    handleInputErrors,
    validateUserExist,
    AuthController.createAccount
)

// Confirm Account
router.post('/confirm-account',
    validateTokenInput,
    handleInputErrors,
    tokenExist,
    AuthController.confirmAccount
)

// Login Account
router.post('/login',
    validateLoginInput,
    handleInputErrors,
    validateUser,
    checkUserNotConfirmed,
    validatePassword,
    AuthController.loginAccount
)

// Resend confirmation code
router.post('/request-code',
    validateEmailInput,
    handleInputErrors,
    validateUser,
    checkUserConfirmed,
    AuthController.requestConfirmationCode
)

// Forgot password
router.post('/forgot-password',
    validateEmailInput,
    handleInputErrors,
    validateUser,
    AuthController.forgotPassword
)

// Confirm token New password
router.post('/validate-token',
    validateTokenInput,
    handleInputErrors,
    tokenExist,
    AuthController.validateToken
)

// Resrt password
router.post('/reset-password/:token',
    validateResetPasswordInput,
    handleInputErrors,
    tokenExist,
    AuthController.resetPasswordWithToken
)

router.get('/user',
    authenticate,
    AuthController.user
)

/** Profile */

router.put('/profile',
    authenticate,
    validateProfileInput,
    handleInputErrors,
    validateUserExist,
    AuthController.updateProfile
)

// Change password
router.post('/update-password',
    authenticate,
    validatePasswordInput,
    handleInputErrors,
    validatePassword,
    AuthController.updatePassword
)


export default router