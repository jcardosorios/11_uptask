import type {Request, Response, NextFunction} from 'express'


export async function validateUserIsNotInTeam(req: Request, res: Response, next: NextFunction){
    try {
        const { user, project } = req
        const isIncluded = project.team.some( team => team.toString() === user.id.toString())
        
        if (isIncluded){
            res.status(409).json({errors: [{
                msg: 'User already in team',
            }]})
            return
        }
        req.user = user
        next()
    } catch (error) {
        next(error)
    }
}

export async function validateUserIsInTeam(req: Request, res: Response, next: NextFunction){
    try {
        const { project } = req
        const { id } = req.body
        const isIncluded = project.team.some( team => team.toString() === id)
        
        if (!isIncluded){
            res.status(409).json({errors: [{
                msg: 'User is not in the project',
            }]})
            return
        }
        next()
    } catch (error) {
        next(error)
    }
}