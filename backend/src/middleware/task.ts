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
            res.status(404).json({errors: [{
                type: "field",
                value: taskId,
                msg: 'Task not found',
                path: "taskId",
                location: "params"
            }]})
            return
        }

        req.task = task
        
        next()
    } catch (error) {
        next(error)
    }
}

export async function taskBelongsToProject(req: Request, res: Response, next: NextFunction){
    try {
        const { project, task } = req

        if(task.project._id.toString() !== project._id.toString()){
            res.status(400).json({errors: [{
                type: "field",
                value: task.project._id.toString(),
                msg: "Action Invalid. Task doesn't belong to the Project",
                path: "taskId",
                location: "params"
            }]})
            return
        }
 
        next()
    } catch (error) {
        next(error)
    }
}