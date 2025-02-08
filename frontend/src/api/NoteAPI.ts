
import api from "@/lib/axios";
import { handleErrorsAxios } from "@/lib/handleErrors";
import { Note, NoteFormData, Project, Task } from "../types";

type NoteAPIType = {
    formData : NoteFormData
    projectId : Project['_id']
    taskId : Task['_id']
    noteId : Note['_id']
}


export async function createNote( {formData, projectId, taskId} : Pick<NoteAPIType, 'formData' | 'projectId' | 'taskId'>) {
    try {
        const url = `/projects/${projectId}/tasks/${taskId}/notes`
        const { data } = await api.post<string>(url, formData)
        return data
    } catch (error) {
        handleErrorsAxios(error)
    }
}

export async function deleteNote( {projectId, taskId, noteId} : Pick<NoteAPIType, 'projectId' | 'taskId' | 'noteId'>) {
    try {
        const url = `/projects/${projectId}/tasks/${taskId}/notes/${noteId}`
        const { data } = await api.delete<string>(url)
        return data
    } catch (error) {
        handleErrorsAxios(error)
    }
}