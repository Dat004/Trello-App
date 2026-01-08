import { create } from "zustand";

const useWorkspaceStore = create((set) => ({
  workspaces: [],
  loading: true,

  setWorkspaces: (workspaces) =>
    set(() => ({
      workspaces,
      loading: false,
    })),

  addWorkspace: (workspace) =>
    set((state) => ({
      workspaces: [workspace, ...state.workspaces],
    })),

  updateWorkspace: (workspace) =>
    set((state) => ({
      workspaces: state.workspaces.map((ws) =>
        ws._id === workspace._id ? workspace : ws
      ),
    })),

  removeWorkspace: (workspaceId) =>
    set((state) => ({
      workspaces: [
        ...state.workspaces.filter((ws) => ws._id !== workspaceId),
      ],
    })),

  clearWorkspaces: () =>
    set(() => ({
      workspaces: [],
      loading: false,
    })),
}));

export default useWorkspaceStore;
