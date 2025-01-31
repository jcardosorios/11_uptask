import { addUserToProject } from "@/api/TeamAPI"
import { TeamMember } from "@/types/index"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"

type SearchResultProps = {
    user: TeamMember
    reset: () => void
}

export default function SearchResult({user, reset} : SearchResultProps) {
    const queryClient = useQueryClient()
    
    const navigate = useNavigate()

    const params = useParams()
    const projectId = params.projectId!
    
    const { mutate } = useMutation({
        mutationFn: addUserToProject,
        onSuccess: (data) => {
            toast.success(data)
            reset()
            queryClient.invalidateQueries({queryKey : ['projectTeam' , projectId]})
            navigate(location.pathname, { replace: true })
        },
        onError: (errors: string[]) => {
            errors.forEach( (message) => toast.error(message))
        }
    })
    
    const handleAddUserToProject = () => mutate({ projectId, userId: user._id})
    
    return (
        <>
            <p className="mt-10 text-center font-bold">Result:</p>
            <div className="flex justify-between items-center">
                <p>{user.name}</p>
                <button
                    onClick={handleAddUserToProject}
                    className="text-purple-600 hover:bg-purple-100 px-10 py-3 font-bold cursor-pointer"
                >
                    Add to Project
                </button>
            </div>
        </>
    )
}
