import {z} from 'zod'

// Auth & Users
const authSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
    password_confirmation: z.string(),
    token: z.string()
})

export type Auth = z.infer<typeof authSchema>
export type UserLoginForm = Pick<Auth, 'email' | 'password'>
export type UserRegistrationForm = Pick<Auth, 'name' | 'email' | 'password' | 'password_confirmation'>
export type RequestConfirmationCodeForm = Pick<Auth, 'email'>
export type ForgotPasswordForm = Pick<Auth, 'email'>
export type NewPasswordForm = Pick<Auth, 'password' | 'password_confirmation'>
export type ConfirmToken = Pick<Auth, 'token'>

/** Users */
export const userSchema = authSchema.pick({
    name: true,
    email: true
}).extend({
    _id: z.string()
})

export type User = z.infer<typeof userSchema>



// Tasks
export const taskStatusSchema = z.enum(['pending', 'onHold', 'inProgress', 'underReview', 'completed'])
export type TaskStatus = z.infer<typeof taskStatusSchema>


export const taskSchema = z.object({
    _id: z.string(),
    taskName: z.string(),
    description: z.string(),
    project: z.string(),
    status: taskStatusSchema,
    completedBy: z.array(z.object({
        _id: z.string(),
        user: userSchema.or(z.string()),
        status: taskStatusSchema
    }).or(z.null())) ,
    createdAt: z.string(),
    updatedAt: z.string()
})

export type Task = z.infer<typeof taskSchema>
export type TaskFormData = Pick<Task, 'taskName' | 'description' >


// Projects

export const projectSchema = z.object({
    _id: z.string(),
    projectName: z.string(),
    clientName: z.string(),
    description: z.string(),
    tasks: z.array(taskSchema),
    manager: z.string(userSchema.pick({_id: true}))
})

export const dashboardProjectSchema = z.array(
    projectSchema.pick({
        _id: true,
        projectName: true,
        clientName: true,
        description: true,
        tasks: true,
        manager: true
    })
)
export type Project = z.infer<typeof projectSchema>
export type ProjectFormData = Pick<Project, 'projectName' | 'clientName' | 'description'>
export type DashboardProject = z.infer<typeof dashboardProjectSchema>

/** Team */
export const teamMemberSchema = userSchema.pick({
    name: true,
    email: true,
    _id: true
})

export const teamSchema = z.array(teamMemberSchema)

export type TeamMember = z.infer<typeof teamMemberSchema>
export type TeamMemberFormData = Pick<TeamMember, 'email'>
export type Team = z.infer<typeof teamSchema>