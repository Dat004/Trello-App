import { queryClient } from "@/lib/react-query";
import { BOARD_KEYS, WORKSPACES_KEYS, WORKSPACE_KEYS } from "@/query/queryKeys";

// Refetch danh sách workspaces và cập nhật store
export const refetchWorkspaces = async () => {
    try {
        console.log("[Refetch] Fetching workspaces...");
        
        await queryClient.invalidateQueries({ queryKey: WORKSPACES_KEYS.all });
        return true;
    } catch (error) {
        console.error("[Refetch] Failed to fetch workspaces:", error);
        return false;
    }
};

// Refetch danh sách boards và cập nhật store
export const refetchBoards = async () => {
    try {
        console.log("[Refetch] Fetching boards...");
        
        await queryClient.invalidateQueries({ queryKey: BOARD_KEYS.all });
        return true;
    } catch (error) {
        console.error("[Refetch] Failed to fetch boards:", error);
        return false;
    }
};

// Refetch workspace hiện tại và cập nhật store
export const refetchCurrentWorkspace = async (workspaceId) => {
    if (!workspaceId) return false;

    try {
        console.log("[Refetch] Fetching current workspace:", workspaceId);
        
        await queryClient.invalidateQueries({ queryKey: WORKSPACE_KEYS.detail(workspaceId) });
        
        return true;
    } catch (error) {
        console.error("[Refetch] Failed to fetch current workspace:", error);
        return false;
    }
};

// Refetch board hiện tại và cập nhật React Query Cache (thay vì store)
export const refetchCurrentBoard = async (boardId) => {
    if (!boardId) return false;

    console.log("[Refetch] Invalidating board detail query:", boardId);
    
    await queryClient.invalidateQueries({ queryKey: BOARD_KEYS.detail(boardId) });

    return true;
};

// Refetch tất cả dữ liệu quan trọng
// Dùng khi reconnect để đảm bảo data consistency
export const refetchAll = async (options = {}) => {
    const { currentWorkspaceId, currentBoardId } = options;

    console.log("[Refetch] Starting full refetch...");

    const results = await Promise.allSettled([
        refetchWorkspaces(),
        refetchBoards(),
        currentWorkspaceId ? refetchCurrentWorkspace(currentWorkspaceId) : Promise.resolve(true),
        currentBoardId ? refetchCurrentBoard(currentBoardId) : Promise.resolve(true),
    ]);

    const success = results.every(
        (result) => result.status === "fulfilled" && result.value === true
    );

    console.log("[Refetch] Full refetch completed:", success ? "success" : "partial failure");
    return success;
};
