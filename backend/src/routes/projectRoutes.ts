import { Router } from 'express'
import { body, param } from 'express-validator'
import { ProjectController } from '../controllers/ProjectController'
import { handleInputErrors } from '../middleware/validation'
import { TaksController } from '../controllers/TaskController'
import { validateProjectExist } from '../middleware/project'

const router = Router()

router.post('/',
    body('projectName')
        .notEmpty().withMessage('Project name is required'),
    body('clientName')
        .notEmpty().withMessage('Client name is required'),
    body('description')
        .notEmpty().withMessage('Description is required'),
    handleInputErrors,
    ProjectController.createProject
)
router.get('/', ProjectController.getAllProjects)
router.get('/:id', 
    param('id').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    ProjectController.getProjectByID
)

router.put('/:id', 
    param('id').isMongoId().withMessage('ID no válido'),
    body('projectName')
        .notEmpty().withMessage('Project name is required'),
    body('clientName')
        .notEmpty().withMessage('Client name is required'),
    body('description')
        .notEmpty().withMessage('Description is required'),
    handleInputErrors,
    ProjectController.updateProject
)

router.delete('/:id', 
    param('id').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    ProjectController.deleteProject
)

/* Routes for tasks */

router.post('/:projectId/tasks', 
    validateProjectExist,
    body('taskName')
        .notEmpty().withMessage('Task name is required'),
    body('description')
        .notEmpty().withMessage('Description is required'),
    handleInputErrors,
    TaksController.createTask
)

router.get('/:projectId/tasks', 
    validateProjectExist,
    TaksController.getAllTasks
)

export default router