
import api from "@/lib/axios";
import { dashboardProjectSchema, Project, ProjectFormData, projectSchema } from "../types";
import { handleErrorsAxios } from "@/lib/handleErrors";

export async function createProject( formData : ProjectFormData) {
    try {
        const { data } = await api.post<string>('/projects', formData)
        return data
    } catch (error) {
        handleErrorsAxios(error)
    }
}

export async function getProjects() {
    try {
        const { data } = await api.get('/projects')
        const response = dashboardProjectSchema.safeParse(data)
        if(response.success){
            return response.data
        }
    } catch (error) {
        handleErrorsAxios(error)
    }
}

export async function getProjectById(id : Project['_id']) {
    try {
        const { data } = await api.get(`/projects/${id}`)
        const response = projectSchema.safeParse(data)
        if(response.success){
            return response.data
        }
    } catch (error) {
        handleErrorsAxios(error)
    }
}

type ProjectAPIType = {
    formData : ProjectFormData
    projectId : Project['_id']
}

export async function updateProjectById({formData, projectId}: ProjectAPIType) {
    try {
        const { data } = await api.put<string>(`/projects/${projectId}`, formData)
        return data
    } catch (error) {
        handleErrorsAxios(error)
    }
}

export async function deleteProject(id : Project['_id']) {
    try {
        const { data } = await api.delete<string>(`/projects/${id}`)
        return data

    } catch (error) {
        handleErrorsAxios(error)
    }
}