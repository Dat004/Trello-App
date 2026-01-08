import { useEffect } from "react";

import { useWorkspaceStore, useAuthStore } from "@/store";
import { workspaceApi } from "@/api/workspace";

const useWorkspaceInit = () => {
  const setWorkspaces = useWorkspaceStore((s) => s.setWorkspaces);
  const clearWorkspaces = useWorkspaceStore((s) => s.clearWorkspaces);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!user) return;

    const fetchWorkspaces = async () => {
      try {
        const res = await workspaceApi.getMyWorkspaces();

        if (res.data?.success) {
          setWorkspaces(res.data.data.workspaces);
          return;
        }

        clearWorkspaces();
      } catch {
        clearWorkspaces();
      }
    };

    fetchWorkspaces();
  }, [user]);
};

export default useWorkspaceInit;
