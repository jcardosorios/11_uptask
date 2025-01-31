
import api from "@/lib/axios";
import { handleErrorsAxios } from "@/lib/handleErrors";
import { Project, TeamMember, TeamMemberFormData, teamMemberSchema } from "../types";

type TeamAPIType = {
    formData : TeamMemberFormData
    projectId : Project['_id']
}

export async function findUserByEmail( {projectId, formData } : TeamAPIType) {
    try {
        const url = `/projects/${projectId}/team/find`
        const { data } = await api.post(url, formData)
        const response = teamMemberSchema.safeParse(data)
        if(response.success){
            return response.data
        } 

    } catch (error) {
        handleErrorsAxios(error)
    }
}

export async function addUserToProject( { projectId, userId } : {projectId : Project['_id'], userId : TeamMember['_id']}) {
    try {
        const url = `/projects/${projectId}/team`
        const { data } = await api.post<string>(url, {id : userId})
        return data

    } catch (error) {
        handleErrorsAxios(error)
    }
}