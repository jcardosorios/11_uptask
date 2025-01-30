import { Router } from 'express'
import { body, param } from 'express-validator'
import { ProjectController } from '../controllers/ProjectController'
import { handleInputErrors, validateCreateProject, validateCreateTask, validateProjectId, validateStatusTask, validateTaskIdType } from '../middleware/validation'
import { TaksController } from '../controllers/TaskController'
import { projectExist, validateUserIsManager } from '../middleware/project'
import { taskBelongsToProject, taskExist } from '../middleware/task'
import { authenticate, userExist } from '../middleware/auth'

const router = Router()


// Authenticate user
router.use(authenticate)

// Validate projectId inputs
router.param('projectId',validateProjectId)
router.param('projectId',handleInputErrors)

// Validate project exist
router.param('projectId', projectExist)

// Create Project
router.post('/',
    validateCreateProject,
    handleInputErrors,
    ProjectController.createProject
)

// Get All Projects
router.get('/',ProjectController.getAllProjects)

// Get one project by ID
router.get('/:projectId',
    validateUserIsManager,
    ProjectController.getProjectByID
)

// Update project
router.put('/:projectId',
    validateUserIsManager,
    validateCreateProject,
    handleInputErrors,
    ProjectController.updateProject
)

// Delete project
router.delete('/:projectId', 
    validateUserIsManager,
    ProjectController.deleteProject
)

// Soft Delete project
router.patch('/:projectId',
    validateUserIsManager,
    ProjectController.softDeleteProject
)


/* Routes for tasks */

// Task Validation Middlewares
router.param('taskId', validateTaskIdType)
router.param('taskId', handleInputErrors)

// Validate task exist
router.param('taskId', taskExist)

// Validate Task belongs to project
router.param('taskId', taskBelongsToProject)

// Create Task
router.post('/:projectId/tasks', 
    validateCreateTask,
    handleInputErrors,
    TaksController.createTask
)

// Get all Tasks
router.get('/:projectId/tasks', TaksController.getAllTasks)

// Get one task by ID
router.get('/:projectId/tasks/:taskId',TaksController.getTaskByID)

// Update task by ID
router.put('/:projectId/tasks/:taskId',
    validateCreateTask,
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
    validateStatusTask,
    handleInputErrors,
    TaksController.updateStatus
)

export default router