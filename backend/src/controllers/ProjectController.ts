import type { Request, Response } from 'express'
import Project from '../models/Project'
import { restart } from 'pm2'
import { handleError } from '../utils/errors'

export class ProjectController {  
    static createProject = async (req : Request, res: Response) => {
        const project = new Project(req.body)
        try {
            await project.save()
            // await Project.create(req.body)
            res.send('Project succesfully created')
        } catch (error) {
            handleError(res, error, "Failed to create the project")
        }
    }

    static getAllProjects = async (req : Request, res: Response) => {
        try {
            const projects = await Project.find({
                isDeleted: false
            }).populate('tasks')
            res.send(projects)
        } catch (error) {
            handleError(res, error, "Failed to fetch projects")
        }
    }

    static getProjectByID = async (req : Request, res: Response) => {
        const { project } = req
        try {
            res.send(project)
        } catch (error) {
            handleError(res, error, "Failed to fetch the project")
        }
    }
    
    static updateProject = async (req : Request, res: Response) => {
        const { project } = req
        try {
            project.projectName = req.body.projectName
            project.clientName = req.body.clientName
            project.description = req.body.description

            await project.save()
            res.send('Project Updated')
        } catch (error) {
            handleError(res, error, "Failed to update the project")
        }
    }
    
    static softDeleteProject = async (req : Request, res: Response) => {
        const { project } = req
        try {
            project.isDeleted = true
            project.deletedAt = new Date()

            await project.save()
            res.send('Project Deleted')
        } catch (error) {
            handleError(res, error, "Failed to delete the project")
        }
    }

    static deleteProject = async (req : Request, res: Response) => {
        const { project } = req
        try {
            await project.deleteOne()
            res.send('Project Deleted')
        } catch (error) {
            handleError(res, error, "Failed to delete the project")
        }
    }
    
}