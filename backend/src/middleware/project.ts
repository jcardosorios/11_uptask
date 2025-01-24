import type {Request, Response, NextFunction} from 'express'
import Project, { IProject } from '../models/Project'

declare global {
    namespace Express {
        interface Request {
            project: IProject
        }
    }
}

export async function projectExist(req: Request, res: Response, next: NextFunction){
    try {
        const { projectId } = req.params
        // Search existing project
        const project = await Project.findById(projectId)
        if (!project || project.isDeleted){
            const error = new Error('Project not found')
            res.status(404).json({errors: [error.message]})
            return
        }

        req.project = project
        
        next()
    } catch (error) {
        res.json({ errors: 'There was an error validating the project: ', error})
    }
}