import { create } from "zustand";

const useBoardStore = create((set) => ({
  boards: [],
  loading: true,
  isInitialized: false,

  setBoards: (boards) =>
    set(() => ({
      boards,
      loading: false,
      isInitialized: true,
    })),

  addBoard: (board) =>
    set((state) => ({
      boards: [board, ...state.boards],
    })),

  updateBoard: (updatedData) =>
    set((state) => ({
      boards: state.boards.map((b) =>
        b._id === updatedData._id ? { ...b, ...updatedData } : b
      ),
    })),

  removeBoard: (boardId) =>
    set((state) => ({
      boards: state.boards.filter((b) => b._id !== boardId),
    })),

  removeBoardsFromWorkspace: (workspaceId) =>
    set((state) => ({
      boards: state.boards.filter((b) => b.workspace !== workspaceId),
    })),

  mergeBoardsFromWorkspace: (workspaceBoards) =>
    set((state) => {
      const existingIds = new Set(state.boards.map(b => b._id));
      const newBoards = workspaceBoards.filter(b => !existingIds.has(b._id));

      return {
        boards: [...state.boards, ...newBoards]
      };
    }),

  clearBoards: () =>
    set(() => ({
      boards: [],
      loading: false,
      isInitialized: false,
    })),
}));

export default useBoardStore;
