// import api from '@/lib/axios'
import { CheckPasswordForm, ConfirmToken, ForgotPasswordForm, NewPasswordForm, RequestConfirmationCodeForm, UserLoginForm, UserRegistrationForm, userSchema } from '../types'
import { handleErrorsAxios } from '../lib/handleErrors'

const DEMO_USER_DATA = {
    _id: 'demo-user-001',
    name: 'Demo User',
    email: 'demo@example.com'
};

export async function createAccount(formData: UserRegistrationForm) {
    try {
        // const url = `/auth/create-account`
        // const { data } = await api.post<string>(url, formData)
        // return data
        console.log('Demo: confirmAccount called with', formData);
        return "Account created successfully (Demo Mode). Please confirm your account (simulated)."
    } catch (error) {
        handleErrorsAxios(error)
    }
}

export async function confirmAccount(formData: ConfirmToken) {
    try {
        // const url = `/auth/confirm-account`
        // const { data } = await api.post<string>(url, formData)
        // return data
        console.log('Demo: requestConfirmationCode called with', formData);
        return "Account confirmed successfully (Demo Mode)."
    } catch (error) {
        handleErrorsAxios(error)
    }
}

export async function requestConfirmationCode(formData: RequestConfirmationCodeForm) {
    try {
        // const url = `/auth/request-code`
        // const { data } = await api.post<string>(url, formData)
        // return data
        console.log('Demo: requestConfirmationCode called with', formData);
        return "Confirmation code sent (Demo Mode)."
    } catch (error) {
        handleErrorsAxios(error)
    }
}

export async function loginAccount(formData: UserLoginForm) {
    try {
        // const url = `/auth/login`
        // const { data } = await api.post<string>(url, formData)
        // localStorage.setItem('AUTH_TOKEN', data)
        // return data
        console.log('Demo: loginAccount called with', formData);
        localStorage.setItem('AUTH_TOKEN', 'demo-token')
        return "Login successful (Demo Mode)."
    } catch (error) {
        handleErrorsAxios(error)
    }
}

export async function forgotPassword(formData: ForgotPasswordForm) {
    try {
        // const url = `/auth/forgot-password`
        // const { data } = await api.post<string>(url, formData)
        // return data
        console.log('Demo: forgotPassword called with', formData);
        return "Password reset instructions sent (Demo Mode)."
    } catch (error) {
        handleErrorsAxios(error)
    }
}

export async function validateToken(formData: ConfirmToken) {
    try {
        // const url = `/auth/validate-token`
        // const { data } = await api.post<string>(url, formData)
        // return data
        console.log('Demo: validateToken called with', formData);
        return "Token is valid (Demo Mode)."
    } catch (error) {
        handleErrorsAxios(error)
    }
}

export async function resetPasswordWithToken({formData, token}: {formData: NewPasswordForm, token: ConfirmToken['token']}) {
    try {
        // const url = `/auth/reset-password/${token}`
        // const { data } = await api.post<string>(url, formData)
        // return data
        console.log('Demo: resetPasswordWithToken called with', formData, token);
        return "Password has been reset successfully (Demo Mode)."
    } catch (error) {
        handleErrorsAxios(error)
    }
}

export async function getUser() {
    try {
        // const { data } = await api.get('/auth/user')
        // const response = userSchema.safeParse(data)
        const response = userSchema.safeParse(DEMO_USER_DATA)
        if(response.success){
            return response.data
        } else {
            // throw new Error("Invalid user data")
            console.error("Demo: Invalid hardcoded user data", response.error.issues);
            throw ["Invalid demo user data structure"]
        }
        
    } catch (error) {
        handleErrorsAxios(error)
        // return { name: "", email: "", _id: "" } 
        return { name: "Error User", email: "error@example.com", _id: "error-id" } 

    }
}

export async function checkPassword( formData : CheckPasswordForm ) {
    try {
        // const { data } = await api.post<string>('/auth/check-password', formData)
        // return data
        console.log('Demo: checkPassword called with', formData);
        return "Password correct (Demo Mode)."
    } catch (error) {
        handleErrorsAxios(error)
    }
}