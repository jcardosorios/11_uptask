import type { Request, Response} from 'express'
import Note, { INote } from '../models/Note'
import { handleError } from '../utils/errors'
import { taskBelongsToProject } from '../middleware/task'

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

    static getTaskNotes = async (req: Request<{}, {}, INote>, res: Response) => {
        try {
            const notes = await Note.find({
                task: req.task.id
            })
            res.json(notes)
        } catch (error) {
            handleError(res, error, "Failed to fetch the notes")
        }
    }

    static deleteTaskNote = async (req: Request, res: Response) => {
        const { note, task } = req
        const { noteId } = req.params
        task.notes = task.notes.filter( mappedNote => mappedNote.toString() !== noteId.toString())
        try {
            await Promise.allSettled([note.deleteOne(), task.save()]) 
            res.send('Note successfully deleted')
        } catch (error) {
            handleError(res, error, "Failed to delete the note")
        }
    }
}