
import { getTaskById } from '@/api/TaskAPI'
import { useQuery } from '@tanstack/react-query'
import { Navigate, useLocation, useParams } from 'react-router-dom'
import EditTaskModal from './EditTaskModal'

export default function EditTaskData() {
    // Get project Id
    const params = useParams()
    const projectId = params.projectId!


    // Get Task Id
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const taskId = queryParams.get('editTask')!
    
    // Get Task by Id
    const { data, isError } = useQuery({
        queryKey: ['task', taskId],
        queryFn: () => getTaskById({projectId, taskId}),
        enabled: !!taskId, // Fetch only when taskId is defined
        retry: false
    })
    if(isError) return <Navigate to='/404'/>
    if (data) return <EditTaskModal dataTask={data}/>
}
