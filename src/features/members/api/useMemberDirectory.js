import { userApi } from "@/api/user";
import { useQuery } from "@tanstack/react-query";

export function useMemberDirectory() {
  return useQuery({
    queryKey: ["memberships", "directory"],
    queryFn: async () => {
      const response = await userApi.getMembershipDirectory();
      if (!response.data?.success) {
        throw new Error(response.data?.message || "Không thể tải danh sách thành viên");
      }
      return response.data.data?.workspaces || [];
    },
    staleTime: 1000 * 60 * 5,
  });
}
