
// import api from "@/lib/axios";
import { handleErrorsAxios } from "../lib/handleErrors";
import { Note, NoteFormData, Project, Task } from "../types";
import { generateId, getDemoProjects, saveDemoProjects } from "../utils/localStorage";

type NoteAPIType = {
    formData : NoteFormData
    projectId : Project['_id']
    taskId : Task['_id']
    noteId : Note['_id']
}


export async function createNote( {formData, projectId, taskId} : Pick<NoteAPIType, 'formData' | 'projectId' | 'taskId'>) {
    try {
        // const url = `/projects/${projectId}/tasks/${taskId}/notes`
        // const { data } = await api.post<string>(url, formData)
        // return data
        const projects = getDemoProjects() as Project[]
        const projectIndex = projects.findIndex((p: Project) => p._id === projectId)
        if (projectIndex === -1) {
            throw [`Project or tasks not found for project ID ${projectId} (Demo Mode)`];
        }
        const taskIndex = projects[projectIndex].tasks.findIndex((t: Task) => t._id === taskId);
        if (taskIndex === -1) {
            throw [`Task with ID ${taskId} not found for note creation (Demo Mode)`];
        }
        const newNote: Note = {
            _id: generateId() as string,
            content: formData.content,
            createdBy: {
                _id: 'demo-user-001',
                name: 'Demo User',
                email: 'demo@example.com'
            },
            task: taskId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
        if (!projects[projectIndex].tasks[taskIndex].notes) {
            projects[projectIndex].tasks[taskIndex].notes = [];
        }
        projects[projectIndex].tasks[taskIndex].notes.push(newNote);
        saveDemoProjects(projects);
        return "Note created successfully (Demo Mode)";
        
    } catch (error) {
        handleErrorsAxios(error)
    }
}

export async function deleteNote( {projectId, taskId, noteId} : Pick<NoteAPIType, 'projectId' | 'taskId' | 'noteId'>) {
    try {
        // const url = `/projects/${projectId}/tasks/${taskId}/notes/${noteId}`
        // const { data } = await api.delete<string>(url)
        // return data
        const projects = getDemoProjects();
        const projectIndex = projects.findIndex((p: Project) => p._id === projectId);
        if (projectIndex === -1 || !projects[projectIndex].tasks) {
            throw [`Project or tasks not found for project ID ${projectId} (Demo Mode)`];
        }
        const taskIndex = projects[projectIndex].tasks.findIndex((t: Task) => t._id === taskId);
        if (taskIndex === -1 || !projects[projectIndex].tasks[taskIndex].notes) {
            throw [`Task or notes not found for task ID ${taskId} (Demo Mode)`];
        }

        projects[projectIndex].tasks[taskIndex].notes = projects[projectIndex].tasks[taskIndex].notes.filter(
            (note: Note) => note._id !== noteId
        );
        saveDemoProjects(projects);
        return "Note deleted successfully (Demo Mode)";
    } catch (error) {
        handleErrorsAxios(error)
    }
}