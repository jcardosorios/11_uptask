import { useForm } from "react-hook-form"
import ErrorMessage from "@/components/ErrorMessage"
import { ChangePasswordForm } from "@/types/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changePassword } from "@/api/ProfileAPI";
import { toast } from "react-toastify";
import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid"

export default function ChangePasswordView() {

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewPasswordConfirmation, setShowNewPasswordConfirmation] = useState(false);
  const initialValues : ChangePasswordForm = {
    password: '',
    new_password: '',
    new_password_confirmation: ''
  }

  const { register, handleSubmit, watch, formState: { errors } } = useForm({ defaultValues: initialValues })

  const new_password = watch('new_password');

  const queryClient = useQueryClient()
    const { mutate } = useMutation({
        mutationFn: changePassword,
        onError: (errors: string[]) => {
            errors.forEach( (message) => toast.error(message))
        },
        onSuccess: (data) => {
            toast.success(data)
            queryClient.invalidateQueries({queryKey: ['user']})
        }
    })

  const handleChangePassword = (formData : ChangePasswordForm) => mutate(formData)

  return (
    <>
      <div className="mx-auto max-w-3xl">

        <h1 className="text-5xl font-black ">Change your Password</h1>
        <p className="text-2xl font-light text-gray-500 mt-5">Change your password here</p>

        <form
          onSubmit={handleSubmit(handleChangePassword)}
          className=" mt-14 space-y-5 bg-white shadow-lg p-10 rounded-lg"
          noValidate
        >
          <div className="mb-5 space-y-3">
            <label
              className="text-sm uppercase font-bold"
              htmlFor="password"
            >Current Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="********"
                className="w-full p-3  border border-gray-200 pr-10"
                {...register("password", {
                  required: "This password is required",
                })}
                
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>

            </div>
            {errors.password && (
              <ErrorMessage>{errors.password.message}</ErrorMessage>
            )}
          </div>

          <div className="mb-5 space-y-3">
            <label
              className="text-sm uppercase font-bold"
              htmlFor="new_password"
            >New Password</label>
            <div className="relative">
              <input
                id="new_password"
                type={showNewPassword ? "text" : "password"}
                placeholder="********"
                className="w-full p-3  border border-gray-200"
                {...register("new_password", {
                  required: "New password is required",
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters'
                  }
                })}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowNewPassword(!showNewPassword)}
                tabIndex={-1}
              >
                {showNewPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>

            </div>
            
            {errors.new_password && (
              <ErrorMessage>{errors.new_password.message}</ErrorMessage>
            )}
          </div>
          <div className="mb-5 space-y-3">
            <label
              htmlFor="new_password_confirmation"
              className="text-sm uppercase font-bold"
            >Repetir Password</label>
            <div className="relative">
              <input
                id="new_password_confirmation"
                type={showNewPasswordConfirmation ? "text" : "password"}
                placeholder="********"
                className="w-full p-3  border border-gray-200"
                {...register("new_password_confirmation", {
                  required: "This field is required",
                  validate: value => value === new_password || 'Passwords do not match'
                })}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowNewPasswordConfirmation(!showNewPasswordConfirmation)}
                tabIndex={-1}
              >
                {showNewPasswordConfirmation ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>

            </div>
            {errors.new_password_confirmation && (
              <ErrorMessage>{errors.new_password_confirmation.message}</ErrorMessage>
            )}
          </div>

          <input
            type="submit"
            value='Change Password'
            className="bg-fuchsia-600 w-full p-3 text-white uppercase font-bold hover:bg-fuchsia-700 cursor-pointer transition-colors"
          />
        </form>
      </div>
    </>
  )
}