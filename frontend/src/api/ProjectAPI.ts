
// import api from "@/lib/axios";
import { generateId, getDemoProjects, saveDemoProjects } from "../utils/localStorage";
import { dashboardProjectSchema, Project, ProjectFormData, projectSchema } from "../types";
import { handleErrorsAxios } from "../lib/handleErrors";


export async function createProject( formData : ProjectFormData) {
    try {
        // const { data } = await api.post<string>('/projects', formData)
        // return data
        const projects = getDemoProjects();
        const newProject: Project = {
            _id: generateId(),
            ...formData,
            tasks: [],
            team: [],
            manager: 'demo-user-001'
        };
        projects.push(newProject);
        saveDemoProjects(projects);
        return "Project created successfully (Demo Mode)";
    } catch (error) {
        handleErrorsAxios(error)
    }
}

export async function getProjects() {
    try {
        // const { data } = await api.get('/projects')
        // const response = dashboardProjectSchema.safeParse(data)
        const projects = getDemoProjects();
        const response = dashboardProjectSchema.safeParse(projects)
        console.log(response)
        if(response.success){
            return response.data
        } else {
            console.error("Demo: Invalid project data in localStorage for dashboard", response.error.issues);
            throw ["Error fetching projects from local storage (Demo Mode)"]; 
        }
    } catch (error) {
        handleErrorsAxios(error)
    }
}

export async function getProjectById(id : Project['_id']) {
    try {
        // const { data } = await api.get(`/projects/${id}`)
        // const response = projectSchema.safeParse(data)
        const projects = getDemoProjects();
        const project = projects.find((p: Project) => p._id === id);
        if (!project) {
            throw [`Project with ID ${id} not found (Demo Mode)`];
        }
        const response = projectSchema.safeParse(project);
        if(response.success){
            return response.data
        } else {
            console.error(`Demo: Invalid project data in localStorage for ID ${id}`, response.error.issues);
            throw ["Error fetching project details from local storage (Demo Mode)"];
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
        // const { data } = await api.put<string>(`/projects/${projectId}`, formData)
        // return data
        let projects = getDemoProjects();
        const projectIndex = projects.findIndex((p: Project) => p._id === projectId);
        if (projectIndex === -1) {
            throw [`Project with ID ${projectId} not found for update (Demo Mode)`];
        }
        projects[projectIndex] = {
            ...projects[projectIndex],
            ...formData
        };
        saveDemoProjects(projects);
        return "Project updated successfully (Demo Mode)";
    } catch (error) {
        handleErrorsAxios(error)
    }
}

export async function deleteProject(id : Project['_id']) {
    try {
        // const { data } = await api.delete<string>(`/projects/${id}`)
        // return data
        let projects = getDemoProjects();
        projects = projects.filter((p: Project) => p._id !== id);
        saveDemoProjects(projects);
        return "Project deleted successfully (Demo Mode)";
    } catch (error) {
        handleErrorsAxios(error)
    }
}