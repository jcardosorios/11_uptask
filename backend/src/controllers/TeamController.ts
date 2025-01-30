import type { Request, Response} from 'express'

export class TeamMemberController {
    static findMemberByEmail = async (req : Request, res: Response) => {
        res.send(req.user)
    }

    static addUserById = async (req : Request, res: Response) => {
        const { project } = req
        project.team.push(req.user)
        await project.save()
        res.send('User added to project')
    }
}