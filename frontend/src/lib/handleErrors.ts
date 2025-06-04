// import { isAxiosError } from "axios"

export function handleErrorsAxios(error: unknown) {
    // if (isAxiosError(error) && error.response) {
    //     const errors = error.response.data.errors
    //     if (Array.isArray(errors)) {
    //         // console.log(errors)
    //         throw errors.map(err => err.msg)
    //     } else {
    //         throw new Error(errors[0])
    //     }
    // }
    // throw new Error("Failed to communicate with the server.")
    if (Array.isArray(error) && error.every(e => typeof e === 'string')) {
        throw error;
    }
    console.error("Demo Mode - Unhandled error type:", error);
    throw ["An unexpected error occurred in demo mode."];
}