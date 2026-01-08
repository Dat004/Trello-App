import { create } from "zustand";

const useBoardStore = create((set) => ({
  boards: [],
  currentBoard: null,
  loading: true,

  setBoards: (boards) =>
    set(() => ({
      boards,
      loading: false,
    })),

  setCurrentBoard: (board) =>
    set(() => ({
      currentBoard: board,
    })),

  addBoard: (board) =>
    set((state) => ({
      boards: [board, ...state.boards],
    })),

  updateBoard: (updatedData) =>
    set((state) => {
      // Update trong danh sách
      const newBoards = state.boards.map((b) =>
        b._id === updatedData._id
          ? { ...b, ...updatedData } // Merge data
          : b
      );

      // Update nếu board đang xem chính là board vừa sửa
      let newCurrent = state.currentBoard;
      if (state.currentBoard && state.currentBoard._id === updatedData._id) {
        newCurrent = { ...state.currentBoard, ...updatedData }; // Merge giữ lại columns/cards
      }

      return {
        boards: newBoards,
        currentBoard: newCurrent,
      };
    }),

  removeBoard: (boardId) =>
    set((state) => ({
      boards: state.boards.filter((b) => b._id !== boardId),
      // Nếu đang xem board bị xóa thì clear màn hình hoặc redirect
      currentBoard:
        state.currentBoard?._id === boardId ? null : state.currentBoard,
    })),

  clearBoards: () =>
    set(() => ({
      boards: [],
      currentBoard: null,
      loading: false,
    })),
}));

export default useBoardStore;
