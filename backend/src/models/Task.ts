import mongoose, { Schema, Document, Types } from "mongoose";
import Note from "./Note";

const taskStatus = {
    PEDING: 'pending',
    ON_HOLD: 'onHold',
    IN_PROGRESS : 'inProgress',
    UNDER_REVIEW: 'underReview',
    COMPLETED: 'completed'
} as const

export type TaskStatus = typeof taskStatus[keyof typeof taskStatus]


export interface ITask extends Document {
    taskName: string
    description: string
    project: Types.ObjectId
    status: TaskStatus
    completedBy: {
        user: Types.ObjectId
        status: TaskStatus
    }[]
    isDeleted: boolean
    deletedAt: Date | null
    notes: Types.ObjectId[]
}

const TaskSchema: Schema = new Schema({
    taskName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    project: {
        type: Types.ObjectId,
        ref: 'Project',
        required: true,
        trim: true
    },
    status : {
        type: String,
        enum: Object.values(taskStatus),
        default: taskStatus.PEDING
    },
    completedBy : [{
        user : {
            type: Types.ObjectId,
            ref: 'User',
            default: null
        },
        status: {
            type: String,
            enum: Object.values(taskStatus),
            default: taskStatus.PEDING
        }
    }],
    notes: [
        {
            type: Types.ObjectId,
            ref: 'Note'
        }
    ],
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null }
}, {timestamps: true})

// Middleware
TaskSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
    const taskId = this._id
    if(!taskId) return
    await Note.deleteMany({task: taskId})
    next()
});

const Task = mongoose.model<ITask>('Task', TaskSchema)
export default Task