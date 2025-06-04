// import { useQuery } from "@tanstack/react-query";
// import { getUser } from "@/api/AuthAPI";
import { User } from "../types";

const DEMO_USER: User = {
    _id: 'demo-user-001',
    name: 'Demo User',
    email: 'demo@example.com'
};

export const useAuth = () => {
    const data = DEMO_USER;
    const isError = false;
    const isLoading = false;

    return { data, isError, isLoading }
}