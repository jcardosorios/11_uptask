import type { Request, Response} from 'express'
import Note, { INote } from '../models/Note'
import { handleError } from '../utils/errors'

export class NoteController {
    static createNote = async (req: Request<{}, {}, INote>, res: Response) => {
        const { content } = req.body
        const note = new Note()
        note.content = content
        note.createdBy = req.user.id
        note.task = req.task.id

        req.task.notes.push(note.id)
        try {
            await Promise.allSettled([req.task.save(), note.save()])
            res.send('Note successfully created')
        } catch (error) {
            handleError(res, error, "Failed to create the note")
        }
    }
}