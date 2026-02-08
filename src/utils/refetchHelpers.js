import { boardApi } from "@/api/board";
import { workspaceApi } from "@/api/workspace";
import { useBoardDetailStore, useBoardStore, useWorkspaceStore } from "@/store";

// Refetch danh sách workspaces và cập nhật store
export const refetchWorkspaces = async () => {
    try {
        console.log("[Refetch] Fetching workspaces...");
        const res = await workspaceApi.getMyWorkspaces();

        if (res.data.success) {
            const { workspaces } = res.data.data;

            useWorkspaceStore.getState().setWorkspaces(workspaces);

            console.log("[Refetch] Workspaces updated:", workspaces.length);
            return true;
        }
        return false;
    } catch (error) {
        console.error("[Refetch] Failed to fetch workspaces:", error);
        return false;
    }
};

// Refetch danh sách boards và cập nhật store
export const refetchBoards = async () => {
    try {
        console.log("[Refetch] Fetching boards...");
        const res = await boardApi.getMyBoards();

        if (res.data.success) {
            const { boards } = res.data.data;

            useBoardStore.getState().setBoards(boards);

            console.log("[Refetch] Boards updated:", boards.length);
            return true;
        }
        return false;
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
        const res = await workspaceApi.getWorkspaceById(workspaceId);

        if (res.data.success) {
            const workspace = res.data.data.workspace;

            const { clearCurrentWorkspace, setCurrentWorkspace, updateWorkspace, setMembers } =
                useWorkspaceStore.getState();

            clearCurrentWorkspace();
            setCurrentWorkspace(workspace);
            updateWorkspace(workspace);
            setMembers(workspace._id, workspace.members);

            console.log("[Refetch] Current workspace updated");
            return true;
        }
        return false;
    } catch (error) {
        console.error("[Refetch] Failed to fetch current workspace:", error);
        return false;
    }
};

// Refetch board hiện tại và cập nhật store
export const refetchCurrentBoard = async (boardId) => {
    if (!boardId) return false;

    try {
        console.log("[Refetch] Fetching current board:", boardId);
        const res = await boardApi.detailBoard(boardId);

        if (res.data.success) {
            const board = res.data.data.board;

            useBoardDetailStore.getState().setCurrentBoard(board);

            console.log("[Refetch] Current board updated");
            return true;
        }
        return false;
    } catch (error) {
        console.error("[Refetch] Failed to fetch current board:", error);
        return false;
    }
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
