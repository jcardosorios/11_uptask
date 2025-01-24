import type { Request, Response} from 'express'
import Task from '../models/Task'

export class TaksController {
    static createTask = async (req : Request, res: Response) => {
        
        const { project } = req
        try {
            const task = new Task(req.body)

            task.project = project.id
            project.tasks.push(task)

            await Promise.allSettled([task.save(), project.save()])

            res.send('Task succesfully created')
        } catch (error) {
            res.status(500).json({ errors: 'There was an error'})
        }
    }

    static getAllTasks = async (req : Request, res: Response) => {
        const { project } = req
        try {
            const tasks = await Task.find({
                project: project.id,
                isDeleted: false
            }).populate('project')
            res.send(tasks)
        } catch (error) {
            res.status(500).json({ errors: 'There was an error'})
        }
    }

    static getTaskByID = async (req : Request, res: Response) => {
        const { task } = req
        try {
            res.send(task)
        } catch (error) {
            res.status(500).json({ errors: 'There was an error'})
        }
    }

    static updateTask = async (req : Request, res: Response) => {
        const { task } = req
        try {
            task.taskName = req.body.taskName
            task.description = req.body.description
            await task.save()
            
            res.send('Task Successfully Updated')
        } catch (error) {
            res.status(500).json({ errors: 'There was an error'})
        }
    }

    static softDeleteTask = async (req : Request, res: Response) => {
        const { project, task } = req

        try {
            project.tasks = project.tasks.filter( mappedTask => mappedTask._id.toString() !== task._id.toString())
            
            task.isDeleted = true;
            task.deletedAt = new Date();

            await Promise.allSettled([task.save(), req.project.save()])
            
            res.send('Task Successfully Deleted')
        } catch (error) {
            res.status(500).json({ errors: 'There was an error'})
        }
    }

    static deleteTask = async (req : Request, res: Response) => {
        const { project, task } = req

        try {
            project.tasks = project.tasks.filter( mappedTask => mappedTask._id.toString() !== task._id.toString())
            await Promise.allSettled([task.deleteOne(), project.save()])
            
            res.send('Task Successfully Deleted')
        } catch (error) {
            res.status(500).json({ errors: 'There was an error'})
        }
    }

    static updateStatus = async (req : Request, res: Response) => {
        const { task } = req
        const { status } = req.body
        
        try {
            task.status = status
            await task.save()
            
            res.send('Status Successfully Updated')
        } catch (error) {
            res.status(500).json({ errors: 'There was an error'})
        }
    }
}