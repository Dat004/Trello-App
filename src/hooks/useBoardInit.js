import { useEffect } from "react";

import { useAuthStore, useBoardStore } from "@/store";
import { boardApi } from "@/api/board";

const useBoardInit = () => {
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

export default useBoardInit;
