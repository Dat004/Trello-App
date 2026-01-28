import { useEffect, useMemo } from "react";

import { useAuthStore, useWorkspaceStore, useBoardStore, useFavoritesStore } from "@/store";
import { UserToast } from "@/context/ToastContext";
import { boardApi } from "@/api/board";

export const useBoardInit = () => {
  const user = useAuthStore((s) => s.user);
  const setBoards = useBoardStore((s) => s.setBoards);
  const clearBoards = useBoardStore((s) => s.clearBoards);

  useEffect(() => {
    if (!user) return;

    const fetchBoards = async () => {
      const res = await boardApi.getMyBoards();

      if (res.data?.success) {
        setBoards(res.data.data.boards);
        return;
      }

      clearBoards();
    };

    fetchBoards();
  }, [user]);
};

export const useBoardsWithFavorites = () => {
  const boards = useBoardStore((s) => s.boards);
  const favoriteBoards = useFavoritesStore((s) => s.favoriteBoards);

  return useMemo(
    () =>
      boards.map((board) => ({
        ...board,
        is_starred: favoriteBoards.some((fb) => fb._id === board._id),
      })),
    [boards, favoriteBoards]
  );
};

export const useBoard = () => {
  const addBoard = useBoardStore((s) => s.addBoard);
  const updateBoardStore = useBoardStore((s) => s.updateBoard);
  const removeBoardStore = useBoardStore((s) => s.removeBoard);
  const workspaces = useWorkspaceStore((s) => s.workspaces);
  const updateWorkspace = useWorkspaceStore((s) => s.updateWorkspace);

  const { addToast } = UserToast();

  const createBoard = async (data) => {
    const res = await boardApi.create(data);
    if (res.data?.success) {
      addBoard(res.data.data.board);
    }

    addToast({
      type: res.data.success ? "success" : "error",
      title: res.data.message,
    });

    return res;
  };

  const updateBoard = async (id, data) => {
    const res = await boardApi.update(id, data);
    if (res.data?.success) {
      updateBoardStore(res.data.data.board);
    }

    addToast({
      type: res.data.success ? "success" : "error",
      title: res.data.message,
    });

    return res;
  };

  const removeBoard = async (id, workspaceId) => {
    const res = await boardApi.delete(id);
    if (res.data?.success) {
      removeBoardStore(id);
    }

    if (workspaceId) {
      updateWorkspace({
        _id: workspaceId,
        board_count: Math.max(workspaces.find(ws => ws._id === workspaceId)?.board_count - 1, 0)
      })
    }

    addToast({
      type: res.data.success ? "success" : "error",
      title: res.data.message,
    });

    return res;
  };

  return { createBoard, updateBoard, removeBoard };
};
