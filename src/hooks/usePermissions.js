import { useMemo } from "react";

import { resolvePermissions } from "@/helpers/permission";
import { useAuthStore } from "@/store";

const usePermissions = ({ board, entity, workspace, workspaceMembers }) => {
  const user = useAuthStore((s) => s.user);

  return useMemo(() => {
    if (!user || !board) return {};

    // Sử dụng workspace được truyền vào hoặc lấy từ board nếu là object
    const resolvedWorkspace = workspace || (board.workspace && typeof board.workspace === 'object' ? board.workspace : null);

    return resolvePermissions({
      userId: user._id?.toString(),
      workspace: resolvedWorkspace,
      board,
      entity,
      workspaceMembers: workspaceMembers || []
    });
  }, [user, board, entity, workspace, workspaceMembers]);
};

export default usePermissions;
