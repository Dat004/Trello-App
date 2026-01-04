import { create } from "zustand";

const useWorkspaceStore = create((set) => ({
  workspaces: [],
  loading: true,

  setWorkspaces: (workspaces) =>
    set(() => ({
      workspaces,
      loading: false,
    })),

  clearWorkspaces: () =>
    set(() => ({
      workspaces: [],
      loading: false,
    })),
}));

export default useWorkspaceStore;
