import type { Request, Response} from 'express'

export class TeamMemberController {
    static findMemberByEmail = async (req : Request, res: Response) => {
        res.send(req.user)
    }

    static addUserById = async (req : Request, res: Response) => {
        const { project } = req

        project.team.push(req.user)
        await project.save()
        res.send('User added to project successfully')
    }

    static getProjectTeam = async (req : Request, res: Response) => {
        const { team } = await req.project.populate('team', 'id name email')
        res.json(team)
    }

    static removeUserById = async (req : Request, res: Response) => {
        const { project } = req
        const { id } = req.body

        project.team = project.team.filter( team => team.toString() !== id)
        await project.save()
        res.send('User deleted from project successfully')
    }

}