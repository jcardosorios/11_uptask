import { Fragment } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTaskById, updateStatus } from '@/api/TaskAPI';
import { toast } from 'react-toastify';
import { formatDate } from '@/utils/utils';
import { statusTranslations } from "@/locales/en"
import { TaskStatus } from '@/types/index';



export default function TaskModalDetails() {
    // Close Modal
    const navigate = useNavigate()
    const closeModal = () => navigate(
        location.pathname, 
        {replace: true}
    )

    // Read if modal exist
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const taskId = queryParams.get('viewTask')!
    const show = !!taskId

    // Get projectId
    const params = useParams()
    const projectId = params.projectId!


    // Fetch info from taskId
    const {data, isError, error} = useQuery({
        queryKey: ['task', taskId],
        queryFn: () => getTaskById({projectId, taskId}),
        enabled: !!taskId,
        retry: false
    })

    // CHange Status
    const queryClient = useQueryClient()
    const { mutate } = useMutation({
        mutationFn: updateStatus,
        onError: (errors: string[]) => {
            errors.forEach( (message) => toast.error(message))
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ['project', projectId]})
            queryClient.invalidateQueries({queryKey: ['task', taskId]})
            toast.success(data)
        }
    })

    const handleChangeStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const data = {
            projectId,
            taskId,
            status: e.target.value as TaskStatus
        }
        mutate(data)
    }


    if(isError) {
        closeModal()

        if(Array.isArray(error)){
            toast.error(error[0], { toastId: 'error'})
        }
        return <Navigate to={`/projects/${projectId}`}/>
    }

    if(data) return (
        <>
            <Transition appear show={show} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
                                    <p className='text-sm text-slate-400'>Created at: { formatDate(data.createdAt)}</p>
                                    <p className='text-sm text-slate-400'>Last update: {formatDate(data.updatedAt)} </p>
                                    <DialogTitle
                                        as="h3"
                                        className="font-black text-4xl text-slate-600 my-5"
                                    >{data.taskName}</DialogTitle>
                                    <p className='text-lg text-slate-500 mb-2'>Descripción: {data.description}</p>
                                    <div className='my-5 space-y-3'>
                                        <label className='font-bold'>State: {}</label>
                                        <select
                                            className='w-full p-3 bg-white border border-gray-300'
                                            onChange={handleChangeStatus}
                                            defaultValue={data.status}
                                        >
                                            {Object.entries(statusTranslations).map(([key, value]) => (
                                                <option
                                                    key={key}
                                                    value={key}
                                                >
                                                    {value}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* Changes history */}
                                    <p className='text-lg text-slate-500 mb-2'>Change history:</p>
                                    <ul className='list-decimal'>
                                    { data.completedBy.map( (activityLog) => (
                                        typeof activityLog?.user === 'object' && (
                                            <li key={activityLog._id}>
                                                <span className='font-bold text-slate-600'>
                                                    {statusTranslations[activityLog.status]} by: {''}
                                                </span>
                                                {activityLog.user.name}
                                            </li>

                                        )
                                    ))}
                                    </ul>

                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}