import { Link } from "react-router-dom";
import { useForm } from 'react-hook-form'
import ProjectForm from "@/components/projects/ProjectForm";

export default function CreateProjectView() {

    const initialValues = {
        projectName : '',
        clientName: '',
        description: ''
    }
    const {register, handleSubmit, formState: { errors }} = useForm({defaultValues: initialValues})
    
    const handleForm = (data) => {
        console.log(data)
    }


    return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-5xl font-black">Create a new Project</h1>
      <p className="text-2xl font-light text-gray-500 mt-5">Fill the next form to create a Project</p>
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
            value="Create Project"
            className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors"
        />
      </form>
    </div>
  )
}
