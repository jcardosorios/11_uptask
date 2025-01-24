import type { Request, Response } from 'express'
import Project from '../models/Project'
import { restart } from 'pm2'

export class ProjectController {  
    static createProject = async (req : Request, res: Response) => {
        const project = new Project(req.body)
        try {
            await project.save()
            // await Project.create(req.body)
            res.json({data: 'Project succesfully created'})
        } catch (error) {
            res.status(500).json({ errors: 'There was an error'})
        }
    }

    static getAllProjects = async (req : Request, res: Response) => {
        try {
            const projects = await Project.find({
                isDeleted: false
            })
            res.json({data: projects})
        } catch (error) {
            res.status(500).json({ errors: 'There was an error'})
        }
    }

    static getProjectByID = async (req : Request, res: Response) => {
        const { project } = req
        try {
            res.json({ data: project})
        } catch (error) {
            res.status(500).json({ errors: 'There was an error'})
        }
    }
    
    static updateProject = async (req : Request, res: Response) => {
        const { project } = req
        try {
            project.projectName = req.body.projectName
            project.clientName = req.body.clientName
            project.description = req.body.description

            await project.save()
            res.json({data:'Project Updated'})
        } catch (error) {
            res.status(500).json({ errors: 'There was an error'})
        }
    }
    
    static softDeleteProject = async (req : Request, res: Response) => {
        const { project } = req
        try {
            project.isDeleted = true
            project.deletedAt = new Date()

            await project.save()
            res.json({data:'Project Deleted'})
        } catch (error) {
            res.status(500).json({ errors: 'There was an error'})
        }
    }

    static deleteProject = async (req : Request, res: Response) => {
        const { project } = req
        try {
            await project.deleteOne()
            res.json({data:'Project Deleted'})
        } catch (error) {
            res.status(500).json({ errors: 'There was an error'})
        }
    }
    
}