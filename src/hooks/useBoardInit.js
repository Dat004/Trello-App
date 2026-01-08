import { useEffect } from "react";
import { useLocation, matchPath } from "react-router-dom";

import { useAuthStore, useBoardStore } from "@/store";
import { boardApi } from "@/api/board";
import paths from "@/config/paths";

const useBoardInit = () => {
  const location = useLocation();

  const user = useAuthStore((s) => s.user);
  const boards = useBoardStore((s) => s.boards);

  const setBoards = useBoardStore((s) => s.setBoards);
  const clearBoards = useBoardStore((s) => s.clearBoards);

  useEffect(() => {
    if (!user) return;

    const isBoardDetail = matchPath(paths.board, location.pathname);
    if (isBoardDetail || boards.length > 0) return;

    const fetchBoards = async () => {
      const res = await boardApi.getMyBoards();

      if (res.data?.success) {
        setBoards(res.data.data.boards);
        return;
      }

      clearBoards();
    };

    fetchBoards();
  }, [location.pathname, boards.length, user]);
};

export default useBoardInit;
