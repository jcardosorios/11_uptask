import type {Request, Response, NextFunction} from 'express'
import Note, { INote } from '../models/Note'
import { Types } from 'mongoose'

declare global {
    namespace Express {
        interface Request {
            note?: INote
        }
    }
}

export async function noteExist(req: Request, res: Response, next: NextFunction){
    try {
        const { noteId } = req.params
        // Search existing note
        const note = await Note.findById(noteId)
        if (!note){
            res.status(404).json({errors: [{
                type: "field",
                value: noteId,
                msg: 'Note not found',
                path: "noteId",
                location: "params"
            }]})
            return
        }

        req.note = note

        next()
    } catch (error) {
        next(error)
    }
}

export async function isCreator(req: Request, res: Response, next: NextFunction){
    try {
        const { user, note } = req
        // Validate who delete the note is the one who created it
        if (note.createdBy.toString() !== user.id.toString()){
            res.status(401).json({errors: [{
                type: "field",
                msg: 'Unauthorized action',
                location: "params"
            }]})
            return
        }

        next()
    } catch (error) {
        next(error)
    }
}