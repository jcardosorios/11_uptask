import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from '@tanstack/react-query'
import { UserRegistrationForm } from "../../types/index";
import ErrorMessage from "../../components/ErrorMessage";
import { createAccount } from "../../api/AuthAPI";
import { toast } from "react-toastify";
import { useState } from "react";

export default function RegisterView() {
    const navigate = useNavigate()

  const [_, setIsLoading] = useState(false)
  const initialValues: UserRegistrationForm = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  }

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<UserRegistrationForm>({ defaultValues: initialValues });

  const { mutate } = useMutation({
    mutationFn: createAccount,
    onError: (errors: string[]) => {
        errors.forEach( (message) => toast.error(message))
    },
    onSuccess: (data) => {
        toast.success(data)
        reset()
        setTimeout(() => {
            navigate('/')
        }, 3000)
    },
    onMutate: () => {
        setIsLoading(true)
    },
    onSettled: () => {
        setIsLoading(false)
    }
  })
  const password = watch('password');

  const handleRegister = (formData: UserRegistrationForm) => {
    mutate(formData)
  }

  // TODO : Crear Spinner para insertarlo

  return (
    <>
        <h1 className="text-5xl font-black text-white">Create account</h1>
        <p className="text-2xl font-light text-white mt-5">
            Fill this form to {''}
            <span className=" text-fuchsia-500 font-bold"> create your account</span>
        </p>

        <form
            onSubmit={handleSubmit(handleRegister)}
            className="space-y-8 p-10  bg-white mt-10"
            noValidate
        >
            <div className="flex flex-col gap-5">
                <label
                    className="font-normal text-2xl"
                    htmlFor="email"
                >Email</label>
                <div>
                    <input
                        id="email"
                        type="email"
                        placeholder="user@email.com"
                        className="w-full p-3  border-gray-300 border"
                        {...register("email", {
                        required: "Email is required",
                        pattern: {
                            value: /\S+@\S+\.\S+/,
                            message: "Email invalid",
                        },
                        })}
                    />
                    {errors.email && (
                        <ErrorMessage>{errors.email.message}</ErrorMessage>
                    )}
                </div>
            </div>

        <div className="flex flex-col gap-5">
            <label
                className="font-normal text-2xl"
            >Name</label>
            <div>
                <input
                    type="name"
                    placeholder="John Doe"
                    className="w-full p-3  border-gray-300 border"
                    {...register("name", {
                    required: "Name is required",
                    })}
                />
                {errors.name && (
                    <ErrorMessage>{errors.name.message}</ErrorMessage>
                )}
            </div>
        </div>

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
            >Repeat Password</label>
            <div>
                <input
                    id="password_confirmation"
                    type="password"
                    placeholder="********"
                    className="w-full p-3  border-gray-300 border"
                    {...register("password_confirmation", {
                    required: "Password confirmation is required",
                    validate: value => value === password || 'Password do not match'
                    })}
                />

                {errors.password_confirmation && (
                    <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>
                )}
            </div>
        </div>

        <input
            type="submit"
            value='Register'
            className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3  text-white font-black  text-xl cursor-pointer"
        />
      </form>
      <nav className="mt-5 flex flex-col space-y-4">
            <Link 
                to={'/auth/login'}
                className="text-center text-gray-300 font-normal"
            >Already have an account? Log in.</Link>
      </nav>
    </>
  )
}