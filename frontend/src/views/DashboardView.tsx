

import { getProjects } from "@/api/ProjectAPI"
import DashboardProjectItem from "@/components/projects/DashboardProjectItem"
import DeleteProjectModal from "@/components/projects/DeleteProjectModal"
import { useAuth } from "@/hooks/useAuth"
import { generateId, getDemoProjects, saveDemoProjects } from "@/utils/localStorage"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import { Link } from "react-router-dom"
import { Project } from "../types"

// Initial Demo Data Seeding Logic
function seedInitialDemoData() {
  const existingProjects = getDemoProjects();
  if (existingProjects.length === 0) {
    const initialProjects: Project[] = [
      {
        _id: generateId() as string,
        projectName: "My First Demo Project",
        clientName: "Demo Client Inc.",
        description: "This is a sample project for the demo mode.",
        tasks: [],
        manager: "demo-user-001",
        team: [],
      },
    ];
    saveDemoProjects(initialProjects);
  }
}


export default function DashboardView() {
  const { data: user, isLoading: authLoading } = useAuth()

  const { data, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects
  })

  useEffect(() => {
    seedInitialDemoData(); // Seed data on component mount if needed
  }, []);


  if(isLoading || authLoading) return 'Loading...'
  
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
      <DeleteProjectModal />
    </>
  )
}
