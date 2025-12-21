import { useQuery } from "@tanstack/react-query";
import { userAPI } from "../utils/api";

export function useCurrentUser() {
    const query = useQuery({
        queryKey: ["currentUser"],
        queryFn: () => userAPI.getCurrentUser(),
        retry: false,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    return {
        ...query,
        user: query.data?.user,
        isAuthenticated: !!query.data?.user
    };
}
