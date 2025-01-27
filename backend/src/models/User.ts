import mongoose, { Schema, Document} from 'mongoose'

export interface IUser extends Document {
    email: string
    password: string
    name: string
    confirmied : boolean
    isDeleted: boolean
    deletedAt: Date | null
}

const userSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    confirmed: {
        type: Boolean,
        default: false,
    },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null }
}, {timestamps: true})

const User = mongoose.model<IUser>('User', userSchema)
export default User