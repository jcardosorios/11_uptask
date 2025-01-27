import { Router } from 'express'
import { body, param } from 'express-validator'
import { ProjectController } from '../controllers/ProjectController'
import { handleInputErrors } from '../middleware/validation'
import { TaksController } from '../controllers/TaskController'
import { projectExist } from '../middleware/project'
import { taskBelongsToProject, taskExist } from '../middleware/task'

const router = Router()

// Create Project
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

// Get All Projects
router.get('/', 
    ProjectController.getAllProjects
)
// Project Validation Middlewares
router.param('projectId',
    param('projectId').isMongoId().withMessage('Invalid Project ID')
)
router.param('projectId',
    handleInputErrors
)
router.param('projectId', projectExist)

// Get one project by ID
router.get('/:projectId', 
    ProjectController.getProjectByID
)

// Update project
router.put('/:projectId', 
    body('projectName')
        .notEmpty().withMessage('Project name is required'),
    body('clientName')
        .notEmpty().withMessage('Client name is required'),
    body('description')
        .notEmpty().withMessage('Description is required'),
    handleInputErrors,
    ProjectController.updateProject
)

// Delete project
router.delete('/:projectId', 
    ProjectController.deleteProject
)

// Soft Delete project
router.patch('/:projectId', 
    ProjectController.softDeleteProject
)


/* Routes for tasks */

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

// Task Validation Middlewares
router.param('taskId', param('taskId').isMongoId().withMessage('Invalid Task ID'))
router.param('taskId', handleInputErrors)
router.param('taskId', taskExist)
router.param('taskId', taskBelongsToProject)

// Get one task by ID
router.get('/:projectId/tasks/:taskId',
    TaksController.getTaskByID
)

// Update task by ID
router.put('/:projectId/tasks/:taskId',
    body('taskName')
        .notEmpty().withMessage('Task name is required'),
    body('description')
        .notEmpty().withMessage('Description is required'),
    handleInputErrors,
    TaksController.updateTask
)

// Soft Delete task by ID
router.patch('/:projectId/tasks/:taskId',
    TaksController.softDeleteTask
)

// Delete task by ID
router.delete('/:projectId/tasks/:taskId',
    TaksController.deleteTask
)

// Update State
router.post('/:projectId/tasks/:taskId/status',
    body('status').notEmpty().withMessage('Status is required'),
    handleInputErrors,
    TaksController.updateStatus
)

export default router