import { useCallback, useRef } from "react";

import { UserToast } from "@/context/ToastContext";

/**
 * Hook for optimistic mutation pattern with undo support.
 *
 * Flow:
 * 1. Snapshot current state
 * 2. Apply optimistic change immediately (0ms UI delay)
 * 3. Call API in background
 * 4. On success → show undo toast with rollback capability
 * 5. On failure → rollback state from snapshot + show error toast
 *
 * @param {Object} options
 * @param {Function} options.applyOptimistic  - Apply change to local state: (payload) => void
 * @param {Function} options.rollback         - Revert state to snapshot:    (snapshot) => void
 * @param {Function} options.apiCall          - The API call to execute:     (payload) => Promise
 * @param {Function} [options.getSnapshot]    - Capture current state:       (payload) => snapshot
 * @param {Function} [options.onSuccess]      - Called after API succeeds:   (apiResponse, payload) => void
 * @param {Function} [options.onError]        - Custom error handler:        (error, payload) => void
 * @param {Function} [options.undoApiCall]    - API call to reverse action:  (snapshot, payload) => Promise
 * @param {Function} [options.getToastMessage]- Generate toast message:      (payload) => string
 * @param {number}   [options.toastDuration]  - Duration for undo toast (ms), default 6000
 */
export function useOptimisticMutation({
  applyOptimistic,
  rollback,
  apiCall,
  getSnapshot,
  onSuccess,
  onError,
  undoApiCall,
  getToastMessage,
  toastDuration = 6000,
}) {
  const { addToast } = UserToast();
  // Prevent concurrent mutations from corrupting snapshots.
  const pendingRef = useRef(false);

  const mutate = useCallback(
    async (payload) => {
      // 1. Snapshot state before mutation
      const snapshot = getSnapshot ? getSnapshot(payload) : null;

      // 2. Apply optimistic change immediately
      applyOptimistic(payload);

      // 3. Mark as pending
      pendingRef.current = true;

      try {
        // 4. Call API in background
        const response = await apiCall(payload);

        // 5. Let the caller handle post-success logic (e.g. update pos from server)
        onSuccess?.(response, payload);

        // 6. Show undo toast (only when we have a way to undo)
        const message = getToastMessage
          ? getToastMessage(payload)
          : "Thao tác thành công";

        if (undoApiCall && snapshot) {
          addToast({
            type: "success",
            title: message,
            duration: toastDuration,
            action: {
              label: "Hoàn tác",
              onClick: async () => {
                // Rollback local state
                rollback(snapshot);
                // Reverse on server
                try {
                  await undoApiCall(snapshot, payload);
                } catch {
                  // If the undo API fails, refetch will reconcile.
                  addToast({
                    type: "error",
                    title: "Không thể hoàn tác. Trang sẽ được tải lại.",
                    duration: 3000,
                  });
                }
              },
            },
          });
        } else {
          addToast({
            type: "success",
            title: message,
            duration: 3000,
          });
        }

        return { success: true, data: response };
      } catch (error) {
        // 7. Rollback on failure
        if (snapshot) {
          rollback(snapshot);
        }

        const errorMsg =
          error?.response?.data?.message || "Có lỗi xảy ra, đã hoàn tác thao tác";

        if (onError) {
          onError(error, payload);
        } else {
          addToast({
            type: "error",
            title: errorMsg,
            duration: 4000,
          });
        }

        return { success: false, error };
      } finally {
        pendingRef.current = false;
      }
    },
    [
      applyOptimistic,
      rollback,
      apiCall,
      getSnapshot,
      onSuccess,
      onError,
      undoApiCall,
      getToastMessage,
      addToast,
      toastDuration,
    ]
  );

  return { mutate, isPending: pendingRef };
}
