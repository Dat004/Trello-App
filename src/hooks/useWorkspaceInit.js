import { useEffect } from "react";

import { workspaceApi } from "@/api/workspace";
import useWorkspaceStore from "@/store/workspaceStore";

const useWorkspaceInit = () => {
  const setWorkspaces = useWorkspaceStore((s) => s.setWorkspaces);
  const clearWorkspaces = useWorkspaceStore((s) => s.clearWorkspaces);

  useEffect(() => {
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
  }, []);
};

export default useWorkspaceInit;
