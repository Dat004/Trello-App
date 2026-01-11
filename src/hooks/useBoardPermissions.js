import { useMemo } from "react";
import { useAuthStore, useWorkspaceStore } from "@/store";
import { getMyRole } from "@/helpers/role";

const useBoardPermissions = (board) => {
  const user = useAuthStore((s) => s.user);
  const workspaces = useWorkspaceStore((s) => s.workspaces);

  return useMemo(() => {
    const userId = user._id.toString();
    const ownerId = board.owner.toString();

    // Xác định Workspace chứa board
    const workspace = board.workspace
      ? workspaces.find((w) => w._id.toString() === board.workspace.toString())
      : null;

    // Xác định Role của User
    const isOwner = userId === ownerId;
    const myRoleInWorkspace = workspace ? getMyRole(workspace.members) : null;
    const myRoleInBoard = getMyRole(board.members);

    // Ưu tiên role trong board, nếu không có thì lấy role trong workspace
    const finalRole = myRoleInBoard || myRoleInWorkspace;

    // Xác định quyền Xóa - Owner Board luôn được xóa
    let canDelete = isOwner;
    
    // Nếu không phải Owner Board -> Check xem có phải Owner/Admin của Workspace không.
    if (!canDelete && workspace) {
      const isWsOwner = workspace.owner.toString() === userId;
      // Check admin trong workspace members
      const isWsAdmin = workspace.members.some(
        (m) => m.user.toString() === userId && m.role === "admin"
      );
      canDelete = isWsOwner || isWsAdmin;
    }

    return {
      role: finalRole,
      canDelete,
      isOwner,
    };
  }, [user, board, workspaces]);
};

export default useBoardPermissions;
