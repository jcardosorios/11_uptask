import { isAxiosError } from "axios"

export function handleErrorsAxios(error: unknown) {
    if (isAxiosError(error) && error.response) {
        const errors = error.response.data.errors
        if (Array.isArray(errors)) {
            // console.log(errors)
            throw errors.map(err => err.msg)
        } else {
            throw new Error(errors[0])
        }
    }
    throw new Error("Failed to communicate with the server.")
}