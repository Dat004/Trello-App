import { boardApi } from "@/api/board";
import { UserToast } from "@/context/ToastContext";
import { useMutation } from "@tanstack/react-query";
import { useBoardContext } from "../context/BoardStateContext";

export function useCreateBoardLabel() {
  const { addToast } = UserToast();
  const { addBoardLabel } = useBoardContext();

  const mutation = useMutation({
    mutationFn: ({ boardId, data }) => boardApi.createLabel(boardId, data),
    onSuccess: (res) => {
      if (res.data?.success) {
        const label = res.data.data.label;
        if (label) addBoardLabel(label);
        addToast({ type: "success", title: "Đã tạo nhãn" });
      } else {
        addToast({
          type: "error",
          title: res.data?.message || "Không thể tạo nhãn",
        });
      }
    },
    onError: (err) => {
      addToast({
        type: "error",
        title: err.response?.data?.message || "Lỗi kết nối server",
      });
    },
  });

  return { ...mutation, isLoading: mutation.isPending };
}

export function useUpdateBoardLabel() {
  const { addToast } = UserToast();
  const { updateBoardLabel } = useBoardContext();

  const mutation = useMutation({
    mutationFn: ({ boardId, labelId, data }) =>
      boardApi.updateLabel(boardId, labelId, data),
    onSuccess: (res, variables) => {
      if (res.data?.success) {
        const label = res.data.data.label;
        if (label) {
          updateBoardLabel(variables.labelId, label, {
            oldName: variables.oldName,
            oldColor: variables.oldColor,
          });
        }
        addToast({ type: "success", title: "Đã cập nhật nhãn" });
      } else {
        addToast({
          type: "error",
          title: res.data?.message || "Không thể cập nhật nhãn",
        });
      }
    },
    onError: (err) => {
      addToast({
        type: "error",
        title: err.response?.data?.message || "Lỗi kết nối server",
      });
    },
  });

  return { ...mutation, isLoading: mutation.isPending };
}

export function useDeleteBoardLabel() {
  const { addToast } = UserToast();
  const { removeBoardLabel } = useBoardContext();

  const mutation = useMutation({
    mutationFn: ({ boardId, labelId }) =>
      boardApi.deleteLabel(boardId, labelId),
    onSuccess: (res, variables) => {
      if (res.data?.success) {
        removeBoardLabel(variables.labelId, variables.labelName);
        addToast({ type: "success", title: "Đã xóa nhãn" });
      } else {
        addToast({
          type: "error",
          title: res.data?.message || "Không thể xóa nhãn",
        });
      }
    },
    onError: (err) => {
      addToast({
        type: "error",
        title: err.response?.data?.message || "Lỗi kết nối server",
      });
    },
  });

  return { ...mutation, isLoading: mutation.isPending };
}
