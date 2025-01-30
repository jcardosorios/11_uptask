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
export const validateProjectId = param('projectId')
    .isMongoId().withMessage('Invalid Project ID');

export const validateCreateProject: ValidationChain[] = [
    body('projectName')
        .notEmpty().withMessage('Project name is required'),
    body('clientName')
        .notEmpty().withMessage('Client name is required'),
    body('description')
        .notEmpty().withMessage('Description is required'),
];

export const validateTaskIdType = param('taskId')
    .isMongoId().withMessage('Invalid Task ID');

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