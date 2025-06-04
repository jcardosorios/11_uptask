import api from '@/lib/axios'
import { handleErrorsAxios } from '@/lib/handleErrors'
import { ChangePasswordForm, UserProfileForm } from '../types'


export async function updateProfile(formData : UserProfileForm) {
    try {
        const url = `/auth/profile`
        const { data } = await api.put<string>(url, formData)
        return data
    } catch (error) {
        handleErrorsAxios(error)
    }
}

export async function changePassword(formData : ChangePasswordForm) {
    try {
        const url = `/auth/update-password`
        const { data } = await api.post<string>(url, formData)
        return data
    } catch (error) {
        handleErrorsAxios(error)
    }
}