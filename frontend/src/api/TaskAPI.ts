// import api from "@/lib/axios";
import { generateId, getDemoProjects, saveDemoProjects } from "@/utils/localStorage";
import { Project, Task, TaskFormData, TaskStatus } from "../types";
import { handleErrorsAxios } from "@/lib/handleErrors";

type TaskAPI = {
    formData: TaskFormData
    projectId: Project['_id']
    taskId : Task['_id']
    status : Task['status']
}

export async function createTask({formData, projectId} : Pick<TaskAPI, 'formData' | 'projectId'>) {
    try {
        // const url = `/projects/${projectId}/tasks`
        // const { data } = await api.post<string>(url, formData)
        // return data
        const projects = getDemoProjects() as Project[]
        const projectIndex = projects.findIndex((p: Project) => p._id === projectId);
        if (projectIndex === -1) {
            throw [`Project with ID ${projectId} not found for update (Demo Mode)`];
        }
        const newTask = {
            _id: generateId() as string,
            taskName: formData.taskName,
            description: formData.description,
            project: projectId,
            status: 'pending' as TaskStatus,
            completedBy: [],
            notes: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
        if(!projects[projectIndex].tasks){
            projects[projectIndex].tasks = []
        }
        projects[projectIndex].tasks.push(newTask)
        saveDemoProjects(projects)
        return "Task created successfully (Demo Mode)"
    } catch (error) {
        handleErrorsAxios(error)
    }
}

export async function getTaskById({projectId, taskId} : Pick<TaskAPI, 'projectId' | 'taskId'>) {
    try {
        // const url = `/projects/${projectId}/tasks/${taskId}`
        // const { data } = await api.get(url)
        // const response = taskSchema.safeParse(data)
        // if(response.success){
        //     return response.data
        // }
        const projects = getDemoProjects() as Project[]
        const project = projects.find((p: Project) => p._id === projectId);
        if (!project) {
            throw [`Project with ID ${projectId} not found (Demo Mode)`];
        }
        const task = project.tasks.find((t: Task) => t._id === taskId);
        if (!task) {
            throw [`Task with ID ${taskId} not found in project ${projectId} (Demo Mode)`];
        }
        return task
    } catch (error) {
        handleErrorsAxios(error)
    }
}

export async function updateTask({formData, projectId, taskId}: Pick<TaskAPI, 'formData'| 'projectId' | 'taskId'>) {
    try {
        // const url = `/projects/${projectId}/tasks/${taskId}`
        // const { data } = await api.put<string>(url, formData)
        // return data
        const projects = getDemoProjects() as Project[]
        const projectIndex = projects.findIndex((p: Project) => p._id === projectId)
        if (projectIndex === -1) {
            throw [`Project or tasks not found for project ID ${projectId} (Demo Mode)`];
        }
        const taskIndex = projects[projectIndex].tasks.findIndex((t: Task) => t._id === taskId)
        if (taskIndex === -1) {
            throw [`Task with ID ${taskId} not found for update (Demo Mode)`];
        }
        projects[projectIndex].tasks[taskIndex] = {
            ...projects[projectIndex].tasks[taskIndex],
            ...formData,
            updatedAt: new Date().toISOString()
        }
        saveDemoProjects(projects)
        return "Task updated successfully (Demo Mode)"
    } catch (error) {
        handleErrorsAxios(error)
    }
}

export async function deleteTask({ projectId, taskId } : Pick<TaskAPI, 'projectId' | 'taskId'>) {
    try {
        // const url = `/projects/${projectId}/tasks/${taskId}`
        // const { data } = await api.delete<string>(url)
        // return data
        const projects = getDemoProjects() as Project[]
        const projectIndex = projects.findIndex((p: Project) => p._id === projectId)
        if (projectIndex === -1){
            throw [`Project or tasks not found for project ID ${projectId} (Demo Mode)`]
        }
        projects[projectIndex].tasks = projects[projectIndex].tasks.filter((t: Task) => t._id !== taskId);
        saveDemoProjects(projects);
        return "Task deleted successfully (Demo Mode)"

    } catch (error) {
        handleErrorsAxios(error)
    }
}

export async function updateStatus({ projectId, taskId, status } : Pick<TaskAPI, 'projectId' | 'taskId' | 'status'>) {
    try {
        // const url = `/projects/${projectId}/tasks/${taskId}/status`
        // const { data } = await api.post<string>(url, {status})
        // return data
        const projects = getDemoProjects() as Project[]
        const projectIndex = projects.findIndex((p: Project) => p._id === projectId)
        if (projectIndex === -1) {
            throw [`Project or tasks not found for project ID ${projectId} (Demo Mode)`];
        }
        const taskIndex = projects[projectIndex].tasks.findIndex((t: Task) => t._id === taskId);
        if (taskIndex === -1) {
            throw [`Task with ID ${taskId} not found for status update (Demo Mode)`];
        }
        projects[projectIndex].tasks[taskIndex].status = status;
        projects[projectIndex].tasks[taskIndex].updatedAt = new Date().toISOString();
        saveDemoProjects(projects);
        return "Task status updated successfully (Demo Mode)"
    } catch (error) {
        handleErrorsAxios(error)
    }
}