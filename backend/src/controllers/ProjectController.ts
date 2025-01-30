import type { Request, Response } from 'express'
import Project from '../models/Project'
import { handleError } from '../utils/errors'
import User from '../models/User'

export class ProjectController {  
    // Create a new project
    static createProject = async (req : Request, res: Response) => {
        const project = new Project(req.body)
        
        // Assign manager
        project.manager = req.user.id
        
        try {
            await project.save()
            
            res.send('Project successfully created')
        } catch (error) {
            handleError(res, error, "Failed to create the project")
        }
    }

    // Fetch all manager's projects
    static getAllProjects = async (req : Request, res: Response) => {
        const { user } = req
        try {
            const projects = await Project.find({
                $and : [
                    { isDeleted: false },
                    {
                        $or: [
                            { manager: { $in : user.id} }
                        ]
                    }
                ],
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