import type { ConfirmToken, NewPasswordForm } from "../../types";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import ErrorMessage from "../../components/ErrorMessage";
import { useMutation } from "@tanstack/react-query";
import { resetPasswordWithToken } from "../../api/AuthAPI";
import { toast } from "react-toastify";

type NewPasswordFormProps = {
    token: ConfirmToken['token']
}


export default function NewPasswordForm({ token } : NewPasswordFormProps) {
    const navigate = useNavigate()

    const { mutate } = useMutation({
        mutationFn: resetPasswordWithToken,
        onSuccess: (data) => {
            toast.success(data)
            navigate('/auth/login')
        },
        onError: (errors : string[]) => {
            errors.forEach( (message) => toast.error(message))
        },
        onMutate: () => {
            reset()
        }
    })
    const initialValues: NewPasswordForm = {
        password: '',
        password_confirmation: '',
    }
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({ defaultValues: initialValues });


    const handleNewPassword = (formData: NewPasswordForm) => mutate({formData, token})

    const password = watch('password');

    return (
        <>
            <form
                onSubmit={handleSubmit(handleNewPassword)}
                className="space-y-8 p-10  bg-white mt-10"
                noValidate
            >

                <div className="flex flex-col gap-5">
                    <label
                        className="font-normal text-2xl"
                    >Password</label>
                    <div>
                        <input
                            type="password"
                            placeholder="********"
                            className="w-full p-3  border-gray-300 border"
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 8,
                                    message: 'Password must be at least 8 characters'
                                }
                            })}
                        />
                        {errors.password && (
                            <ErrorMessage>{errors.password.message}</ErrorMessage>
                        )}

                    </div>
                </div>

                <div className="flex flex-col gap-5">
                    <label
                        className="font-normal text-2xl"
                    >Repetir Password</label>
                    <div>
                        <input
                            id="password_confirmation"
                            type="password"
                            placeholder="Repeat password"
                            className="w-full p-3  border-gray-300 border"
                            {...register("password_confirmation", {
                                required: "This field is required",
                                validate: value => value === password || 'Passwords do not match'
                            })}
                        />

                        {errors.password_confirmation && (
                            <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>
                        )}

                    </div>
                </div>

                <input
                    type="submit"
                    value='Reset Password'
                    className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3  text-white font-black  text-xl cursor-pointer"
                />
            </form>
        </>
    )
}