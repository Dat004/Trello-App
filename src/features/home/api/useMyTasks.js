import { userApi } from "@/api/user";
import { useQuery } from "@tanstack/react-query";

export const MY_TASKS_KEYS = {
    all: ['my-tasks'],
    filter: (filter) => [...MY_TASKS_KEYS.all, filter]
};

export function useMyTasks(filter = 'all') {
    return useQuery({
        queryKey: MY_TASKS_KEYS.filter(filter),
        queryFn: async () => {
            const res = await userApi.getMyTasks({ filter });
            if (!res.data?.success) throw new Error(res.data?.message || "Failed to fetch tasks");

            return res.data.data?.tasks || [];
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}
