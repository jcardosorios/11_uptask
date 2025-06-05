import { addUserToProject } from "../../api/TeamAPI"
import { Team, TeamMember } from "../../types/index"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"

type SearchResultProps = {
    user: TeamMember
    reset: () => void
}

export default function SearchResult({user, reset} : SearchResultProps) {
    const navigate = useNavigate()
    
    // Get project ID
    const params = useParams()
    const projectId = params.projectId!
    
    // Mutation to add user to the team
    const queryClient = useQueryClient()
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

    const isInTeam = useMemo(() => {
        const team = queryClient.getQueryData<Team>(["projectTeam", projectId]);
        return team ? team.some((member) => member._id === user._id) : false;
    }, [user]);
    
    return (
        <>
            <p className="mt-10 text-center font-bold">Result:</p>
            <div className="flex justify-between items-center">
                <p>{user.name}</p>
                <button
                    onClick={handleAddUserToProject}
                    className={`px-10 py-3 font-bold rounded transition ${
                        isInTeam
                            ? "text-gray-400 bg-gray-200 cursor-not-allowed"
                            : "text-purple-600 hover:bg-purple-100 cursor-pointer"
                    }`}
                    disabled={isInTeam}
                >
                    {isInTeam ? "Already in the project" : "Add to Project"}
                </button>
            </div>
        </>
    )
}
