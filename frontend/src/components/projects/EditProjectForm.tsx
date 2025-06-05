import { Link, useNavigate } from "react-router-dom";
import ProjectForm from "./ProjectForm";
import { Project, ProjectFormData } from "../../types/index";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProjectById } from "../../api/ProjectAPI";
import { toast } from "react-toastify";

type EditProjectFormProps = {
    data: ProjectFormData
    projectId: Project['_id']
}

export default function EditProjectForm({data, projectId} : EditProjectFormProps) {
    const navigate = useNavigate()
    
    const initialValues : ProjectFormData = {
        projectName : data.projectName,
        clientName: data.clientName,
        description: data.description
    }

    const {register, handleSubmit, formState: { errors }} = useForm({defaultValues: initialValues})
    
    const queryClient = useQueryClient()
    const { mutate } = useMutation({
        mutationFn: updateProjectById,
        onError: (errors: string[]) => {
            errors.forEach( (message) => toast.error(message))
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ['projects']})
            queryClient.invalidateQueries({queryKey: ['editProject', projectId]})
            toast.success(data)
            navigate('/')
        }
    })
    const handleForm = (formData: ProjectFormData) => {
        const data = {
            formData,
            projectId
        }
        mutate(data)
    }
    
    return (
    <div className="max-w-2xl mx-auto">
        <h1 className="text-5xl font-black">Edit Project</h1>
        <p className="text-2xl font-light text-gray-500 mt-5">Fill the next form to edit your Project</p>
        <nav className="my-5">
            <Link
                className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bol cursor-pointer transition-colors"
                to="/"
            >Back to Projects</Link>
        </nav>
        <form 
            onSubmit={handleSubmit(handleForm)}
            className="mt-10 bg-white shadow-lg p-10 rounded-lg"
            noValidate
        >
            <ProjectForm 
                register={register}
                errors={errors}
            />
            <input 
                type="submit" 
                value="Save Changes"
                className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors"
            />
        </form>
    </div>
  )
}
