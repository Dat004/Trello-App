import { activitiesApi } from "@/api/activities";
import { useQuery } from "@tanstack/react-query";

export const MY_ACTIVITIES_KEYS = {
    all: ['my-activities'],
    list: (params) => [...MY_ACTIVITIES_KEYS.all, params]
};

export function useMyActivities(limit = 20) {
    return useQuery({
        queryKey: MY_ACTIVITIES_KEYS.list({ limit }),
        queryFn: async () => {
            const res = await activitiesApi.getMyActivities({ limit });
            if (!res.data?.success) throw new Error(res.data?.message || "Failed to fetch activities");

            return res.data.data?.activities || [];
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}
