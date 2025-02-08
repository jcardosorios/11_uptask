import type { Request, Response, NextFunction} from 'express'
import { body, param, ValidationChain, validationResult } from 'express-validator'

export const handleInputErrors = (req : Request, res: Response, next : NextFunction) => {
    let errors = validationResult(req)
    if(!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array()})
        return
    }
    next()

}
export const validateProjectIdType = param('projectId')
    .isMongoId().withMessage('Invalid ID');

export const validateTaskIdType = param('taskId')
    .isMongoId().withMessage('Invalid ID');
    
export const validateUserIdTypeBody = body('userId')
    .isMongoId().withMessage('Invalid ID');

export const validateUserIdTypeParam = param('userId')
    .isMongoId().withMessage('Invalid ID');

export const validateNoteIdType = param('noteId')
    .isMongoId().withMessage('Invalid ID');

export const validateCreateProject: ValidationChain[] = [
    body('projectName')
        .notEmpty().withMessage('Project name is required'),
    body('clientName')
        .notEmpty().withMessage('Client name is required'),
    body('description')
        .notEmpty().withMessage('Description is required'),
];


export const validateCreateTask: ValidationChain[] = [
    body('taskName')
        .notEmpty().withMessage('Task name is required'),
    body('description')
        .notEmpty().withMessage('Description is required'),
];

export const validateStatusTask: ValidationChain[] = [
    body('status')
        .notEmpty().withMessage('Status is required'),
];

export const validateCreateAccount: ValidationChain[] = [
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
];

export const validateTokenInput: ValidationChain[] = [
    body('token')
        .notEmpty().withMessage('Token is required')
];

export const validateLoginInput: ValidationChain[] = [
    body('email')
    .isEmail().withMessage('Email must be valid'),
    body('password')
    .notEmpty().withMessage('Password is required')
];

export const validateEmailInput: ValidationChain[] = [
    body('email')
        .isEmail().withMessage('Email must be valid')
];

export const validateResetPasswordInput: ValidationChain[] = [
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
];

export const validateCreateNote: ValidationChain[] = [
    body('content')
        .notEmpty().withMessage('Note content is required')
]

export const validateProfileInput: ValidationChain[] = [
    body('name')
    .notEmpty().withMessage('Name is required'),
    body('email')
        .isEmail().withMessage('Email must be valid'),
];