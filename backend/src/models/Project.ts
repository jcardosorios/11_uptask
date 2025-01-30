import mongoose, { Schema, Document, Types, PopulatedDoc } from "mongoose";
import { ITask } from "./Task";
import { IUser } from "./User";


export interface IProject extends Document {
    projectName: string
    clientName: string
    description: string
    tasks: PopulatedDoc<ITask & Document>[]
    manager: PopulatedDoc<IUser & Document>
    isDeleted: boolean
    deletedAt: Date | null
}

const ProjectSchema: Schema = new Schema({
    projectName: {
        type: String,
        required: true,
        trim: true
    },
    clientName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    tasks: [
        {
            type: Types.ObjectId,
            ref: 'Task'
        }
    ],
    manager: {
        type: Types.ObjectId,
        ref: 'User'
    },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null }
}, { timestamps: true })

const Project = mongoose.model<IProject>('Project', ProjectSchema)
export default Project