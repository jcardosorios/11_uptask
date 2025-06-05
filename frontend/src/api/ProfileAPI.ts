// import api from '@/lib/axios'
import { handleErrorsAxios } from '../lib/handleErrors'
import { ChangePasswordForm, UserProfileForm } from '../types'
import { getDemoUserProfile, saveDemoUserProfile } from '../utils/localStorage'


export async function updateProfile(formData : UserProfileForm) {
    try {
        // const url = `/auth/profile`
        // const { data } = await api.put<string>(url, formData)
        // return data
        const userProfile = getDemoUserProfile()
        if (!userProfile) {
            throw ["User profile not found (Demo Mode)"];
        }
        const updatedProfile = {
            ...userProfile,
            ...formData
        };
        saveDemoUserProfile(updatedProfile);
        return "Profile updated successfully (Demo Mode)";
    } catch (error) {
        handleErrorsAxios(error)
    }
}

export async function changePassword(formData : ChangePasswordForm) {
    try {
        // const url = `/auth/update-password`
        // const { data } = await api.post<string>(url, formData)
        // return data
        console.log('Demo: changePassword called with', formData);
        return "Password changed successfully (Demo Mode)."
    } catch (error) {
        handleErrorsAxios(error)
    }
}