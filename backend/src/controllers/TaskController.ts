import type { Request, Response} from 'express'
import Task from '../models/Task'

export class TaksController {
    static createTask = async (req : Request, res: Response) => {
        
        try {
            const { project } = req
            const task = new Task(req.body)

            task.project = project.id
            project.tasks.push(task)

            await Promise.allSettled([task.save(), project.save()])

            res.json({data: 'Task succesfully created'})
        } catch (error) {
            res.status(500).json({ errors: 'There was an error'})
        }
    }

    static getAllTasks = async (req : Request, res: Response) => {
        try {
            const { project } = req
            const tasks = await Task.find({
                project: project.id
            }).populate('project')
            res.json({data: tasks})
        } catch (error) {
            res.status(500).json({ errors: 'There was an error'})
        }
    }
}