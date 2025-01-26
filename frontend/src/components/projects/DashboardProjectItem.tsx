import { Fragment } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import { Link } from 'react-router-dom'
import { Project } from '@/types/index'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteProject } from '@/api/ProjectAPI'
import { toast } from 'react-toastify'

type DashboardProjectItemProps = {
    project: Project
}

export default function DashboardProjectItem({project} : DashboardProjectItemProps) {
    const queryClient = useQueryClient()
    const { mutate } = useMutation({
        mutationFn: deleteProject,
        onError: (errors: string[]) => {
            errors.forEach( (message) => toast.error(message))
        },
        onSuccess : (data) => {
            queryClient.invalidateQueries({queryKey: ['projects']})
            toast.success(data)
        }
    
    })
    
    return (
    <>
    {/* Main project info */}
    <div className="flex min-w-0 gap-x-4">
        <div className="min-w-0 flex-auto space-y-2">
            <Link to={`/projects/${project._id}`}
                className="text-gray-600 cursor-pointer hover:underline text-3xl font-bold"
            >{project.projectName}</Link>
            <p className="text-sm text-gray-400">
                Cliente: {project.clientName}
            </p>
            <p className="text-sm text-gray-400">
                {project.description}
            </p>
        </div>
    </div>
    {/* Project actions */}
    <div className="flex shrink-0 items-center gap-x-6 cursor-pointer">
        <Menu as="div" className="relative flex-none">
            <MenuButton className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900 cursor-pointer">
                <span className="sr-only">opciones</span>
                <EllipsisVerticalIcon className="h-9 w-9" aria-hidden="true" />
            </MenuButton>
            <Transition as={Fragment} enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95">
                <MenuItems
                    className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none"
                >   
                    {/* Go to project */}
                    <MenuItem>
                        <Link to={`/projects/${project._id}`}
                            className='block px-3 py-1 text-sm leading-6 text-gray-900 hover:bg-gray-100'>
                            Go to project
                        </Link>
                    </MenuItem>
                    {/* Edit Project */}
                    <MenuItem>
                        <Link to={`/projects/${project._id}/edit`}
                            className='block px-3 py-1 text-sm leading-6 text-gray-900 hover:bg-gray-100'>
                            Edit
                        </Link>
                    </MenuItem>
                    {/* Delete Project */}
                    <MenuItem>
                        <button 
                            type='button' 
                            className='block px-3 py-1 text-sm leading-6 w-full text-left text-red-500 cursor-pointer hover:bg-gray-100'
                            onClick={() => mutate(project._id) }
                        > Delete</button>
                    </MenuItem>
                </MenuItems>
            </Transition>
        </Menu>
    </div>
    </>

  )
}
