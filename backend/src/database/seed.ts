import mongoose, { Types } from 'mongoose';
import Project from '../models/Project' // Asegúrate de usar las rutas correctas
import Task, { ITask } from '../models/Task';
import dotenv from 'dotenv'
import User from '../models/User';
import { hashPassword } from '../utils/auth';

dotenv.config()

export interface IDraftTask {
    taskName: string
    description: string
    project: Types.ObjectId
}

const connectDB = async () => {
    try {
        const dbUri = process.env.DB_URI;
        if (!dbUri) {
            throw new Error('DB_URI is not defined in the environment variables');
        }
      await mongoose.connect(dbUri);
      console.log('MongoDB connected');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      process.exit(1);
    }
};

// Limpiar las colecciones
const clearDatabase = async () => {
    try {
        await Project.deleteMany({});
        await Task.deleteMany({});
        await User.deleteMany({});
        console.log('Database cleared');
    } catch (error) {
        console.error('Error clearing database:', error);
        process.exit(1);
    }
};

const seedDatabase = async () => {
    try {
        const users = await User.insertMany([
            {
                email: 'email1@mail.com',
                password: await hashPassword('87654321'),
                name: 'Joaquin Rios',
                confirmed: true
            },
            {
                email: 'email2@gmail.com',
                password: await hashPassword('12345678'),
                name: 'Filomeno Gutierrez',
                confirmed: true
            },
            {
                email: 'email3@gmail.com',
                password: await hashPassword('12345678'),
                name: 'Eustaquio Ramirez',
                confirmed: true
            },
        ])

        console.log('Users seeded')



        const projects = await Project.insertMany([
            {
              projectName: 'Website Redesign',
              clientName: 'Client A',
              description: 'Redesign the existing website for better UX/UI',
              manager: users[0]._id as Types.ObjectId,
              team: [users[1]._id as Types.ObjectId, users[2]._id as Types.ObjectId]
            },
            {
              projectName: 'Mobile App Development',
              clientName: 'Client B',
              description: 'Develop a cross-platform mobile app',
              manager: users[0]._id as Types.ObjectId,
              team: [users[1]._id as Types.ObjectId]
            },
            {
              projectName: 'API Integration',
              clientName: 'Client C',
              description: 'Integrate third-party APIs into the existing system',
              manager: users[1]._id as Types.ObjectId,
              team: [users[0]._id as Types.ObjectId]
            },
        ]);
    
        console.log('Projects seeded');
        // console.log('Projects seeded:', projects);

        for (const project of projects) {
            const tasks: IDraftTask[]  = [];
            
            tasks.push({
                    taskName: 'Initial Planning',
                    description: `Plan the ${project.projectName}`,
                    project: project._id as Types.ObjectId,
            })

            tasks.push({
                taskName: 'Design',
                description: `Create designs for the ${project.projectName}`,
                project: project._id as Types.ObjectId,
            })

            tasks.push({
                taskName: 'Development',
                description: `Develop the core features for the ${project.projectName}`,
                project: project._id as Types.ObjectId,
            })

      
            const tasksCreated =await Task.insertMany(tasks)
            for (const task of tasksCreated){
                project.tasks.push(task._id as Types.ObjectId)
                await project.save()
            }
        }

        console.log('Tasks seeded');
        
    } catch (error) {
        console.log(error)
    }
}


const runSeed = async () => {
    await connectDB()
    await clearDatabase()
    await seedDatabase()
    mongoose.connection.close();
    console.log('DB closed')
    console.log('Seed finished')
}

runSeed()