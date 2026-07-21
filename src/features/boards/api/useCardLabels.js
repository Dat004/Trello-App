import { cardApi } from "@/api/card";
import { UserToast } from "@/context/ToastContext";
import { useMutation } from "@tanstack/react-query";
import { useBoardContext } from "../context/BoardStateContext";

export function useAssignCardLabel() {
  const { addToast } = UserToast();
  const { assignCardLabel } = useBoardContext();

  const mutation = useMutation({
    mutationFn: ({ boardId, listId, cardId, data }) =>
      cardApi.assignLabelToCard(boardId, listId, cardId, data),
    onSuccess: (res, variables) => {
      if (res.data?.success) {
        const label = res.data.data.label;
        if (label) assignCardLabel(variables.cardId, label);
        addToast({ type: "success", title: "Đã gán nhãn" });
      } else {
        addToast({
          type: "error",
          title: res.data?.message || "Không thể gán nhãn",
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

export function useRemoveCardLabel() {
  const { addToast } = UserToast();
  const { removeCardLabel } = useBoardContext();

  const mutation = useMutation({
    mutationFn: ({ boardId, listId, cardId, labelId }) =>
      cardApi.removeLabelFromCard(boardId, listId, cardId, labelId),
    onSuccess: (res, variables) => {
      if (res.data?.success) {
        removeCardLabel(variables.cardId, variables.labelId);
        addToast({ type: "success", title: "Đã gỡ nhãn" });
      } else {
        addToast({
          type: "error",
          title: res.data?.message || "Không thể gỡ nhãn",
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
