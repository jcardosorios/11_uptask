import { FieldErrors, UseFormRegister } from "react-hook-form"
import { TaskFormData } from "@/types/index";
import ErrorMessage from "../ErrorMessage";

type TaskFormProps = {
    errors: FieldErrors<TaskFormData>
    register: UseFormRegister<TaskFormData>
}

export default function TaskForm({errors, register} : TaskFormProps) {
    
    
    return (
        <>
            <div className="flex flex-col gap-3">
                <label
                    className="font-normal text-2xl"
                    htmlFor="taskName"
                >Task Name</label>
                <div>
                    <input
                        id="taskName"
                        type="text"
                        placeholder="E.g., Create Homepage Wireframe"
                        className="w-full p-3 border-gray-300 border"
                        {...register("taskName", {
                            required: "Task name is required",
                        })}
                    />
                    {errors.taskName && (
                        <ErrorMessage>{errors.taskName.message}</ErrorMessage>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <label
                    className="font-normal text-2xl"
                    htmlFor="description"
                >Description</label>
                <div>
                    <textarea
                        id="description"
                        placeholder="E.g., Design the initial wireframe for the homepage, ensuring a responsive layout and a clear call-to-action."
                        className="w-full p-3  border-gray-300 border"
                        {...register("description", {
                            required: "Description is required"
                        })}
                    />
                    {errors.description && (
                        <ErrorMessage>{errors.description.message}</ErrorMessage>
                    )}
                </div>
            </div>
        </>
    )
}