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

            res.json({data: 'Task succesfully created'})
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
            res.json({data: tasks})
        } catch (error) {
            res.status(500).json({ errors: 'There was an error'})
        }
    }

    static getTaskByID = async (req : Request, res: Response) => {
        const { taskId } = req.params
        try {
            const task = await Task.findById(taskId).populate('project')
            if (!task || task.isDeleted){
                const error = new Error('Task not found')
                res.status(404).json({errors: [error.message]})
                return
            }
            if(task.project._id.toString() !== req.project.id){
                const error = new Error('Invalid action')
                res.status(400).json({errors: [error.message]})
                return
            }
            res.json({ data: task})
        } catch (error) {
            res.status(500).json({ errors: 'There was an error'})
        }
    }

    static updateTask = async (req : Request, res: Response) => {
        const { taskId } = req.params
        try {
            const task = await Task.findByIdAndUpdate(taskId, req.body)
            if (!task || task.isDeleted){
                const error = new Error('Task not found')
                res.status(404).json({errors: [error.message]})
                return
            }
            if(task.project._id.toString() !== req.project.id){
                const error = new Error('Invalid action')
                res.status(400).json({errors: [error.message]})
                return
            }
            res.json({ data: 'Task Successfully Updated'})
        } catch (error) {
            res.status(500).json({ errors: 'There was an error'})
        }
    }

    static softDeleteTask = async (req : Request, res: Response) => {
        const { project } = req
        const { taskId } = req.params
        try {
            const task = await Task.findById(taskId)

            if (!task || task.isDeleted){
                const error = new Error('Task not found')
                res.status(404).json({errors: [error.message]})
                return
            }
            if(task.project._id.toString() !== req.project.id){
                const error = new Error('Invalid action')
                res.status(400).json({errors: [error.message]})
                return
            }
            project.tasks = project.tasks.filter( task => task._id.toString() !== taskId)
            
            task.isDeleted = true;
            task.deletedAt = new Date();

            await Promise.allSettled([task.save(), req.project.save()])
            
            res.json({ data: 'Task Successfully Deleted'})
        } catch (error) {
            res.status(500).json({ errors: 'There was an error'})
        }
    }

    static deleteTask = async (req : Request, res: Response) => {
        const { project } = req
        const { taskId } = req.params
        try {
            const task = await Task.findById(taskId)

            if (!task || task.isDeleted){
                const error = new Error('Task not found')
                res.status(404).json({errors: [error.message]})
                return
            }
            if(task.project._id.toString() !== req.project.id){
                const error = new Error('Invalid action')
                res.status(400).json({errors: [error.message]})
                return
            }
            req.project.tasks = req.project.tasks.filter( task => task._id.toString() !== taskId)


            await Promise.allSettled([task.deleteOne(), req.project.save()])
            
            res.json({ data: 'Task Successfully Deleted'})
        } catch (error) {
            res.status(500).json({ errors: 'There was an error'})
        }
    }
}