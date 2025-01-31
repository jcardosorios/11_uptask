import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ErrorMessage from "../ErrorMessage";
import { TeamMemberFormData, User } from "@/types/index";
import { findUserByEmail } from "@/api/TeamAPI";
import SearchResult from "./SearchResult";
import { toast } from "react-toastify";

export default function AddMemberForm() {
    // Get projectId
    const params = useParams()
    const projectId = params.projectId!

    const initialValues: TeamMemberFormData = {
        email: ''
    }

    // Instant queryClient
    const queryClient = useQueryClient()
    
    // useForm
    const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: initialValues })

    // Mutation to find user
    const mutation = useMutation({
        mutationFn: findUserByEmail,
    })

    // Handler
    const handleSearchUser = async (formData : TeamMemberFormData) => {
        const currentUser = queryClient.getQueryData<User>(["user"]);
        if(currentUser?.email === formData.email) return toast.error("You can't add yourself to the project")
            
        const data = {projectId, formData}
        mutation.mutate(data)
    }

    // Reset
    const resetData = () => {
        reset()
        mutation.reset()
    }

    

    return (
        <>

            <form
                className="mt-10 space-y-5"
                onSubmit={handleSubmit(handleSearchUser)}
                noValidate
            >

                <div className="flex flex-col gap-3">
                    <label
                        className="font-normal text-2xl"
                        htmlFor="name"
                    >User email</label>
                    <div>
                        <input
                            id="name"
                            type="text"
                            placeholder="E.g., user@email.com"
                            className="w-full p-3  border-gray-300 border"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /\S+@\S+\.\S+/,
                                    message: "Invalid email",
                                },
                            })}
                        />
                        {errors.email && (
                            <ErrorMessage>{errors.email.message}</ErrorMessage>
                        )}
                    </div>
                </div>

                <input
                    type="submit"
                    className=" bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3  text-white font-black  text-xl cursor-pointer"
                    value='Buscar Usuario'
                />
            </form>
            <div className="mt-10">
                {mutation.isPending && <p className="text-center">Loading...</p>}
                {mutation.error && Array.isArray(mutation.error) && <p className="text-center">{mutation.error[0]}</p>}
                {mutation.data && <SearchResult user={mutation.data} reset={resetData}/>}
            </div>
        </>
    )
}