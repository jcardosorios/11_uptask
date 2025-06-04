import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/api/AuthAPI";
import { User } from "../types";

export const useAuth = () => {
    const { data, isError, isLoading } = useQuery<User>({
        queryKey: ['user'],
        queryFn: getUser,
        retry: false,
        refetchOnWindowFocus: false
    })

    return {data, isError, isLoading}
}