import { Fragment } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { Task, TaskFormData, taskSchema } from '@/types/index';
import { useForm } from 'react-hook-form';
import TaskForm from './TaskForm';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTask } from '@/api/TaskAPI';
import { toast } from 'react-toastify';

type EditTaskDataProps = {
    dataTask: Task
}

export default function EditTaskModal({ dataTask } : EditTaskDataProps) {
    const navigate = useNavigate()
    
    // Get project ID
    const params = useParams()
    const projectId = params.projectId!
    
    // Close Modal
    const closeModal = () => navigate(location.pathname, {replace: true})
    
    // Hook for form
    const { register, handleSubmit, reset, formState: {errors} } = useForm<TaskFormData>({defaultValues: {
        taskName: dataTask.taskName,
        description: dataTask.description
    }})
    
    // Mutation to Edit
    const queryClient = useQueryClient()
    const { mutate } = useMutation({
        mutationFn: updateTask,
        onError: (errors: string[]) => {
            errors.forEach( (message) => toast.error(message))
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ['project', projectId]})
            queryClient.invalidateQueries({queryKey: ['task', dataTask._id]})
            toast.success(data)
            reset(),
            closeModal()
        }
        
    })

    // Handle Submit
    const handleEditTask = (formData: TaskFormData) => {
        const data = {
            formData,
            projectId: projectId,
            taskId: dataTask._id
        }

        mutate(data)
    }
    
    return (
        <Transition appear show={true} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={closeModal }>
                {/* navigate(location.pathname, {replace: true}) Remove URL params */}
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/60" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-16">
                                <DialogTitle
                                    as="h3"
                                    className="font-black text-4xl  my-5"
                                >
                                    Edit Task
                                </DialogTitle>

                                <p className="text-xl font-bold">Make changes to a task in {''}
                                    <span className="text-fuchsia-600">this form</span>
                                </p>

                                <form
                                    className="mt-10 space-y-3"
                                    onSubmit={handleSubmit(handleEditTask)}
                                    noValidate
                                >
                                    <TaskForm 
                                        register={register}
                                        errors={errors}
                                    />
                                    <input
                                        type="submit"
                                        className=" bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3  text-white font-black  text-xl cursor-pointer"
                                        value='Save Task'
                                    />
                                </form>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}