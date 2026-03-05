import { templatesApi } from "@/api/templates";
import { useQuery } from "@tanstack/react-query";

export const TEMPLATE_KEYS = {
    all: ["templates"],
    popular: ["templates", "popular"],
};

export function useTemplates() {
    return useQuery({
        queryKey: TEMPLATE_KEYS.all,
        queryFn: async () => {
            const res = await templatesApi.getAllTemplates();
            if (!res.data?.success)
                throw new Error(res.data?.message || "Failed to fetch templates");
            return res.data.data?.templates || [];
        },
        staleTime: 1000 * 60 * 10, // 10 minutes
    });
}

export function usePopularTemplates() {
    return useQuery({
        queryKey: TEMPLATE_KEYS.popular,
        queryFn: async () => {
            const res = await templatesApi.getPopularTemplates();
            if (!res.data?.success)
                throw new Error(
                    res.data?.message || "Failed to fetch popular templates"
                );
            return res.data.data?.templates || [];
        },
        staleTime: 1000 * 60 * 10,
    });
}
