import mongoose, { Schema, Document } from "mongoose";

export type ProjectType = Document & {
    projectName: string
    clientName: string
    description: string
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
    isDeleted: { type: Boolean, default: false }, // Campo de borrado lógico
    deletedAt: { type: Date, default: null }      // Fecha de eliminación
})

const Project = mongoose.model<ProjectType>('Project', ProjectSchema)
export default Project