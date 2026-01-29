import { useEffect, useMemo } from "react";

import { useAuthStore, useFavoritesStore, useWorkspaceStore, useBoardStore } from "@/store";
import { UserToast } from "@/context/ToastContext";
import { workspaceApi } from "@/api/workspace";

export const useWorkspaceInit = () => {
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

export const useWorkspacesWithFavorites = () => {
  const workspaces = useWorkspaceStore((s) => s.workspaces);
  const favoriteWorkspaces = useFavoritesStore((s) => s.favoriteWorkspaces);

  return useMemo(
    () =>
      workspaces.map((ws) => ({
        ...ws,
        is_starred: favoriteWorkspaces.some((fw) => fw._id === ws._id),
      })),
    [workspaces, favoriteWorkspaces]
  );
};

export const useWorkspace = () => {
  const addWorkspace = useWorkspaceStore((s) => s.addWorkspace);
  const updateWorkspaceInStore = useWorkspaceStore((s) => s.updateWorkspace);
  const removeWorkspaceInStore = useWorkspaceStore((s) => s.removeWorkspace);
  const removeBoardsFromWorkspace = useBoardStore((s) => s.removeBoardsFromWorkspace);
  const { addToast } = UserToast();

  const createWorkspace = async (data) => {
    const res = await workspaceApi.create(data);
    if (res.data?.success) {
      addWorkspace(res.data.data.workspace);
    }

    addToast({
      type: res.data.success ? "success" : "error",
      title: res.data.message,
    });

    return res;
  };

  const updateWorkspace = async (id, data) => {
    const res = await workspaceApi.update(id, data);
    if (res.data?.success) {
      updateWorkspaceInStore(res.data.data.workspace);
    }

    addToast({
      type: res.data.success ? "success" : "error",
      title: res.data.message,
    });

    return res;
  };

  const removeWorkspace = async (workspaceId) => {
    const res = await workspaceApi.delete(workspaceId);
    if (res.data?.success) {
      removeWorkspaceInStore(workspaceId);
      removeBoardsFromWorkspace(workspaceId);
    }

    addToast({
      type: res.data.success ? "success" : "error",
      title: res.data.message,
    });

    return res;
  };

  return { createWorkspace, updateWorkspace, removeWorkspace };
};
