import mongoose, { Types } from 'mongoose';
import Project from '../models/Project' // Asegúrate de usar las rutas correctas
import Task, { ITask } from '../models/Task';
import dotenv from 'dotenv'

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
        await Task.deleteMany({});
        await Project.deleteMany({});
        console.log('Database cleared');
    } catch (error) {
        console.error('Error clearing database:', error);
        process.exit(1);
    }
};

const seedDatabase = async () => {
    try {
        const projects = await Project.insertMany([
            {
              projectName: 'Website Redesign',
              clientName: 'Client A',
              description: 'Redesign the existing website for better UX/UI',
            },
            {
              projectName: 'Mobile App Development',
              clientName: 'Client B',
              description: 'Develop a cross-platform mobile app',
            },
            {
              projectName: 'API Integration',
              clientName: 'Client C',
              description: 'Integrate third-party APIs into the existing system',
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
}

runSeed()