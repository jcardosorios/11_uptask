import type { Request, Response} from 'express'
import Task from '../models/Task'
import { handleError } from '../utils/errors'

export class TaksController {
    static createTask = async (req : Request, res: Response) => {
        
        const { project } = req
        try {
            const task = new Task(req.body)

            task.project = project.id
            project.tasks.push(task)

            await Promise.allSettled([task.save(), project.save()])

            res.status(201).send('Task succesfully created')
        } catch (error) {
            handleError(res, error, "Failed to create the task")
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
            handleError(res, error, "Failed to fetch tasks")
        }
    }

    static getTaskByID = async (req : Request, res: Response) => {
        const task = await Task.findById(req.task.id)
                .populate({path:'completedBy.user', select: 'id name email'})
                .populate({path:'notes', populate: {
                    path: 'createdBy',
                    select: 'id name email'
                }})
        try {
            res.send(task)
        } catch (error) {
            handleError(res, error, "Failed to fetch the task")
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
            handleError(res, error, "Failed to update the task")
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
            handleError(res, error, "Failed to delete the task")
        }
    }

    static deleteTask = async (req : Request, res: Response) => {
        const { project, task } = req

        try {
            project.tasks = project.tasks.filter( mappedTask => mappedTask._id.toString() !== task._id.toString())
            await Promise.allSettled([task.deleteOne(), project.save()])
            
            res.send('Task Successfully Deleted')
        } catch (error) {
            handleError(res, error, "Failed to delete the task")
        }
    }

    static updateStatus = async (req : Request, res: Response) => {
        const { task, user } = req
        const { status } = req.body
        
        try {
            task.status = status

            const data = {
                user: user.id,
                status
            }
            task.completedBy.push(data)
            await task.save()
            
            res.send('Status Successfully Updated')
        } catch (error) {
            handleError(res, error, "Failed to update the task status")
        }
    }
}