import api from '@/lib/axios'
import { CheckPasswordForm, ConfirmToken, ForgotPasswordForm, NewPasswordForm, RequestConfirmationCodeForm, UserLoginForm, UserRegistrationForm, userSchema } from '../types'
import { handleErrorsAxios } from '@/lib/handleErrors'

export async function createAccount(formData: UserRegistrationForm) {
    try {
        const url = `/auth/create-account`
        const { data } = await api.post<string>(url, formData)
        return data
    } catch (error) {
        handleErrorsAxios(error)
    }
}

export async function confirmAccount(formData: ConfirmToken) {
    try {
        const url = `/auth/confirm-account`
        const { data } = await api.post<string>(url, formData)
        return data
    } catch (error) {
        handleErrorsAxios(error)
    }
}

export async function requestConfirmationCode(formData: RequestConfirmationCodeForm) {
    try {
        const url = `/auth/request-code`
        const { data } = await api.post<string>(url, formData)
        return data
    } catch (error) {
        handleErrorsAxios(error)
    }
}

export async function loginAccount(formData: UserLoginForm) {
    try {
        const url = `/auth/login`
        const { data } = await api.post<string>(url, formData)
        localStorage.setItem('AUTH_TOKEN', data)
        return data
    } catch (error) {
        handleErrorsAxios(error)
    }
}

export async function forgotPassword(formData: ForgotPasswordForm) {
    try {
        const url = `/auth/forgot-password`
        const { data } = await api.post<string>(url, formData)
        return data
    } catch (error) {
        handleErrorsAxios(error)
    }
}

export async function validateToken(formData: ConfirmToken) {
    try {
        const url = `/auth/validate-token`
        const { data } = await api.post<string>(url, formData)
        return data
    } catch (error) {
        handleErrorsAxios(error)
    }
}

export async function resetPasswordWithToken({formData, token}: {formData: NewPasswordForm, token: ConfirmToken['token']}) {
    try {
        const url = `/auth/reset-password/${token}`
        const { data } = await api.post<string>(url, formData)
        return data
    } catch (error) {
        handleErrorsAxios(error)
    }
}

export async function getUser() {
    try {
        const { data } = await api.get('/auth/user')
        console.log(data)
        const response = userSchema.safeParse(data)
        console.log(response)
        
        if(response.success){
            return response.data
        }
        
        return data
    } catch (error) {
        handleErrorsAxios(error)
    }
}

export async function checkPassword( formData : CheckPasswordForm ) {
    try {
        const { data } = await api.post<string>('/auth/check-password', formData)
        return data
    } catch (error) {
        handleErrorsAxios(error)
    }
}