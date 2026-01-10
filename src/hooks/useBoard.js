import { UserToast } from "@/context/ToastContext";
import { useBoardStore } from "@/store";
import { boardApi } from "@/api/board";

function useBoard() {
  const addBoard = useBoardStore((s) => s.addBoard);
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

  return { createBoard };
}

export default useBoard;
