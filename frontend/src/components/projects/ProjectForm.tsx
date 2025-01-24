import { FieldErrors, UseFormRegister } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";

type ProjectNameProps = {
    register: UseFormRegister<{
        projectName: string;
        clientName: string;
        description: string;
    }>;
    errors: FieldErrors<{
        projectName: string;
        clientName: string;
        description: string;
    }>;
}

export default function ProjectForm({register, errors} : ProjectNameProps) {
    return (
        <>
            <div className="mb-5 space-y-3">
                <label htmlFor="projectName" className="text-sm uppercase font-bold">
                    Project Name
                </label>
                <input
                    id="projectName"
                    className="w-full p-3  border border-gray-200"
                    type="text"
                    placeholder="E.g., Website Redesign for Acme Co."
                    {...register("projectName", {
                        required: "Project name is required",
                    })}
                />

                {errors.projectName && (
                    <ErrorMessage>{errors.projectName.message}</ErrorMessage>
                )}
            </div>

            <div className="mb-5 space-y-3">
                <label htmlFor="clientName" className="text-sm uppercase font-bold">
                    Client Name
                </label>
                <input
                    id="clientName"
                    className="w-full p-3  border border-gray-200"
                    type="text"
                    placeholder="E.g., John Smith, Acme Corporation"
                    {...register("clientName", {
                        required: "Client name is required",
                    })}
                />

                {errors.clientName && (
                    <ErrorMessage>{errors.clientName.message}</ErrorMessage>
                )}
            </div>

            <div className="mb-5 space-y-3">
                <label htmlFor="description" className="text-sm uppercase font-bold">
                    Description
                </label>
                <textarea
                    id="description"
                    className="w-full p-3 h-40 border border-gray-200"
                    placeholder="E.g., Redesign the client's website to improve user experience and mobile responsiveness, with a modern aesthetic."
                    {...register("description", {
                        required: "Project description is required"
                    })}
                />

                {errors.description && (
                    <ErrorMessage>{errors.description.message}</ErrorMessage>
                )}
            </div>
        </>
    )
}