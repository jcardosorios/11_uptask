
// import api from "@/lib/axios";
import { handleErrorsAxios } from "@/lib/handleErrors";
import { Project, TeamMember, TeamMemberFormData, teamMemberSchema, teamSchema } from "../types";
import { getDemoProjects, saveDemoProjects } from "@/utils/localStorage";

type TeamAPIType = {
    formData : TeamMemberFormData
    projectId : Project['_id']
}

const DEMO_TEAM_MEMBER_FOUND: TeamMember = {
    _id: 'demo-team-member-002',
    name: 'Demo Teammate',
    email: 'team@example.com'
};

export async function findUserByEmail( {projectId, formData } : TeamAPIType) {
    try {
        // const url = `/projects/${projectId}/team/find`
        // const { data } = await api.post(url, formData)
        // const response = teamMemberSchema.safeParse(data)
        // if(response.success){
        //     return response.data
        // } 
        console.log(`Demo: findUserByEmail called for project ${projectId} with email ${formData.email}`);
        if (formData.email.toLowerCase() === 'team@example.com') {
            return DEMO_TEAM_MEMBER_FOUND;
        }

        throw [`User with email ${formData.email} not found (Demo Mode). Try 'team@example.com'`];

    } catch (error) {
        handleErrorsAxios(error)
    }
}

export async function addUserToProject( { projectId, userId } : {projectId : Project['_id'], userId : TeamMember['_id']}) {
    try {
        // const url = `/projects/${projectId}/team`
        // const { data } = await api.post<string>(url, {userId})
        // return data
        const projects = getDemoProjects();
        const projectIndex = projects.findIndex((p: Project) => p._id === projectId);
        if (projectIndex === -1) {
            throw [`Project with ID ${projectId} not found (Demo Mode)`];
        }

        let userToAdd = DEMO_TEAM_MEMBER_FOUND; 
        if (userId !== DEMO_TEAM_MEMBER_FOUND._id) {
            console.warn(`Demo: Adding user with ID ${userId} which is different from the standard demo teammate.`);
            userToAdd = { _id: userId, name: `User ${userId.substring(0,5)}`, email: `${userId.substring(0,5)}@example.com`};
        }

        if (!projects[projectIndex].team) {
            projects[projectIndex].team = [];
        }

        if (projects[projectIndex].team.find((member: TeamMember) => member._id === userToAdd._id)) {
            return "User is already in the project team (Demo Mode)";
        }

        projects[projectIndex].team.push(userToAdd);
        saveDemoProjects(projects);
        return "User added to project successfully (Demo Mode)";

    } catch (error) {
        handleErrorsAxios(error)
    }
}

export async function getProjectTeam(projectId: Project['_id']) {
    try {
        // const url = `/projects/${projectId}/team`
        // const { data } = await api.get<string>(url)
        // const response = teamSchema.safeParse(data)
        // if(response.success){
        //     return response.data
        // }
        const projects = getDemoProjects();
        const project = projects.find((p: Project) => p._id === projectId);
        if (!project) {
            throw [`Project with ID ${projectId} not found (Demo Mode)`];
        }
        return project.team || [];
    } catch (error) {
        handleErrorsAxios(error)
    }
}

export async function removeMemberFromProject({ projectId, userId } : {projectId : Project['_id'], userId : TeamMember['_id']}) {
    try {
        // const url = `/projects/${projectId}/team/${userId}`
        // const { data } = await api.delete<string>(url)
        // return data
        const projects = getDemoProjects();
        const projectIndex = projects.findIndex((p: Project) => p._id === projectId);
        if (projectIndex === -1 || !projects[projectIndex].team) {
            throw [`Project or team not found for project ID ${projectId} (Demo Mode)`];
        }

        projects[projectIndex].team = projects[projectIndex].team.filter((member: TeamMember) => member._id !== userId);
        saveDemoProjects(projects);
        return "User removed from project successfully (Demo Mode)";
    } catch (error) {
        handleErrorsAxios(error)
    }
}