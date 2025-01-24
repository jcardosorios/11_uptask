import { Router } from 'express'
import { body, param } from 'express-validator'
import { ProjectController } from '../controllers/ProjectController'
import { handleInputErrors } from '../middleware/validation'
import { TaksController } from '../controllers/TaskController'
import { projectExist } from '../middleware/project'
import { taskBelongsToProject, taskExist } from '../middleware/task'

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
    param('id').isMongoId().withMessage('Invalid ID'),
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
router.param('projectId', projectExist)

// Create Task
router.post('/:projectId/tasks', 
    body('taskName')
        .notEmpty().withMessage('Task name is required'),
    body('description')
        .notEmpty().withMessage('Description is required'),
    handleInputErrors,
    TaksController.createTask
)

// Get all Tasks
router.get('/:projectId/tasks', 
    TaksController.getAllTasks
)

router.param('taskId', taskExist)
router.param('taskId', taskBelongsToProject)

// Get one task by ID
router.get('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    TaksController.getTaskByID
)

// Update task by ID
router.put('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('Invalid ID'),
    body('taskName')
        .notEmpty().withMessage('Task name is required'),
    body('description')
        .notEmpty().withMessage('Description is required'),
    handleInputErrors,
    TaksController.updateTask
)

// Soft Delete task by ID
router.patch('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    TaksController.softDeleteTask
)

// Delete task by ID
router.delete('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    TaksController.deleteTask
)

// Update Stake
router.post('/:projectId/tasks/:taskId/status',
    param('taskId').isMongoId().withMessage('Invalid ID'),
    body('status').notEmpty().withMessage('Status is required'),
    handleInputErrors,
    TaksController.updateStatus
)

export default router