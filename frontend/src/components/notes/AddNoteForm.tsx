import { NoteFormData } from '@/types/index'
import { useForm } from 'react-hook-form'
import ErrorMessage from '../ErrorMessage'
import { useLocation, useParams } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createNote } from '@/api/NoteAPI'
import { toast } from 'react-toastify'

export default function AddNoteForm() {
    // Get projectId
    const params = useParams()
    const projectId = params.projectId!

    // Get taskId
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const taskId = queryParams.get('viewTask')!

    const initialValues : NoteFormData = {
        content: ''
    }

    // Hook form
    const { register, handleSubmit, formState: {errors}, reset } = useForm({defaultValues: initialValues})

    // Mutation
    const queryClient = useQueryClient()
    const { mutate } = useMutation({
        mutationFn: createNote,
        onError: (errors: string[]) => {
            errors.forEach( (message) => toast.error(message))
        },
        onSuccess: (data) => {
            toast.success(data)
            queryClient.invalidateQueries({queryKey: ['task', taskId]})
        }
    })
    const handleAddNote = (formData: NoteFormData) => {
        const data = {
            projectId,
            taskId,
            formData
        }
        mutate(data)
        reset()
    }

    return (
    <form
        onSubmit={handleSubmit(handleAddNote)}
        className="space-y-3"
        noValidate
    >
        <div
            className="flex flex-col gap-2"
        >
            <label 
                className="font-bold"
                htmlFor="content"
            >Create Note</label>
            <div>
                <input
                    id="content"
                    type="text"
                    placeholder="Content of the note"
                    className="w-full p-3 border border-gray-300"
                    {...register('content', {
                        required: 'Note content is required'
                    } )}
                />
                {errors.content && (
                    <ErrorMessage>{errors.content.message}</ErrorMessage>
                )}
            </div>
            <input 
                type="submit" 
                value="Create note" 
                className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-2 text-white cursor-pointer font-black"
            />
        </div>
    </form>
  )
}
