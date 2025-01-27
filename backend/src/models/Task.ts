import mongoose, { Schema, Document, Types } from "mongoose";

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
    isDeleted: boolean
    deletedAt: Date | null
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
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null }
}, {timestamps: true})

const Task = mongoose.model<ITask>('Task', TaskSchema)
export default Task