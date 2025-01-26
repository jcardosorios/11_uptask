import api from "@/lib/axios";
import { Project, TaskFormData } from "../types";
import { handleErrorsAxios } from "@/lib/handleErrors";

type TaskAPI = {
    formData: TaskFormData
    projectId: Project['_id']
}

export async function createTask({formData, projectId} : Pick<TaskAPI, 'formData' | 'projectId'>) {
    try {
        const url = `/projects/${projectId}/tasks`
        const { data } = await api.post<string>(url, formData)
        return data
    } catch (error) {
        handleErrorsAxios(error)
    }
}