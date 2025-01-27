import { Fragment } from 'react'
import { Task } from "@/types/index"
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react"
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteTask } from '@/api/TaskAPI'
import { toast } from 'react-toastify'

type TypeCardProps = {
    task : Task
}

export default function TaskCard({task} : TypeCardProps) {
    const navigate = useNavigate()

    // Get Project ID
    const params = useParams()
    const projectId = params.projectId!

    // Delete task mutation
    const queryClient = useQueryClient()
    const { mutate } = useMutation({
        mutationFn: deleteTask,
        onError: (errors: string[]) => {
            errors.forEach( (message) => toast.error(message))
        },
        onSuccess : (data) => {
            queryClient.invalidateQueries({queryKey: ['project', projectId]})
            toast.success(data)
        }
    
    })
    return (
    <li className="p-5 bg-white border-slate-300 flex justify-between gap-3">
        <div className="min-w-0 flex flex-col gap-y-4">
            <button
                type="button"
                className="text-xl font-bold text-slate-600 text-left"
            >{task.taskName}</button>
            <p
                className="text-slate-500"
            >{task.description}</p>
        </div>
        <div className="flex shrink-0  gap-x-6">
            <Menu as="div" className="relative flex-none">
                <MenuButton className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900 cursor-pointer">
                    <span className="sr-only">options</span>
                    <EllipsisVerticalIcon className="h-9 w-9" aria-hidden="true" />
                </MenuButton>
                <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                    <MenuItems
                        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none ">
                        <MenuItem>
                            <button 
                            type='button' 
                            onClick={() => navigate(location.pathname + `?viewTask=${task._id}&`) }
                            className='block px-3 py-1 text-sm leading-6 text-gray-900 w-full text-left hover:bg-gray-100 cursor-pointer'>
                                View Task
                            </button>
                        </MenuItem>
                        <MenuItem>
                            <button 
                            type='button' 
                            onClick={() => navigate(location.pathname + `?editTask=${task._id}&`) }
                            className='block px-3 py-1 text-sm leading-6 text-gray-900 w-full text-left hover:bg-gray-100 cursor-pointer'>
                                Edit
                            </button>
                        </MenuItem>

                        <MenuItem>
                            <button 
                                type='button' 
                                onClick={() => mutate({projectId, taskId :task._id})}
                                className='block px-3 py-1 text-sm leading-6 text-red-500 w-full text-left hover:bg-gray-100 cursor-pointer'>
                                Delete
                            </button>
                        </MenuItem>
                    </MenuItems>
                </Transition>
            </Menu>
        </div>
    </li>
  )
}
