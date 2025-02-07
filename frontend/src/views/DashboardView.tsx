

import { getProjects } from "@/api/ProjectAPI"
import DashboardProjectItem from "@/components/projects/DashboardProjectItem"
import { useAuth } from "@/hooks/useAuth"
import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"


export default function DashboardView() {
  const { data: user, isLoading: authLoading } = useAuth()

  const { data, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects
  })


  if(isLoading || authLoading) return 'Cargando...'

  if(data && user) return (
    <>
      <h1 className="text-5xl font-black">My Projects</h1>
      <p className="text-2xl font-light text-gray-500 mt-5">Manage your projects</p>
      <nav className="my-5">
        <Link
          className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bol cursor-pointer transition-colors"
          to="/projects/create"
        >New Project</Link>
        
      </nav>
      { data.length ? (
        <ul role="list" className="divide-y divide-gray-100 border border-gray-100 mt-10 bg-white shadow-lg">
          {data.map((project) => (
            <li key={project._id} className="flex justify-between gap-x-6 px-5 py-10">
              <DashboardProjectItem project={project} user={user} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center py-20">There are no projects yet. {''}
          <Link
            className="text-fuchsia-500 font-bold"
            to="/projects/create"
          >Create a new Project</Link>
        </p>
      )}

    </>
  )
}
