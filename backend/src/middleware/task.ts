import type {Request, Response, NextFunction} from 'express'
import Task, { ITask } from '../models/Task'

declare global {
    namespace Express {
        interface Request {
            task: ITask
        }
    }
}

export async function taskExist(req: Request, res: Response, next: NextFunction){
    try {

        const { taskId } = req.params
        // Search existing project
        const task = await Task.findById(taskId)
        if (!task || task.isDeleted){
            const error = new Error('Task not found')
            res.status(404).json({errors: [error.message]})
            return
        }

        req.task = task
        
        next()
    } catch (error) {
        res.json({ errors: 'There was an error validating the task: ', error})
    }
}

export async function taskBelongsToProject(req: Request, res: Response, next: NextFunction){
    try {
        const { project, task } = req

        if(task.project._id.toString() !== project._id.toString()){
            const error = new Error('Invalid action')
            res.status(400).json({errors: [error.message]})
            return
        }
 
        next()
    } catch (error) {
        res.json({ errors: 'There was an error validating the task: ', error})
    }
}