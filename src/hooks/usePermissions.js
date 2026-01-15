import { useMemo } from "react";

import { resolvePermissions } from "@/helpers/permission";
import { useAuthStore, useWorkspaceStore } from "@/store";

const usePermissions = ({ board, entity }) => {
  const user = useAuthStore((s) => s.user);
  const workspaces = useWorkspaceStore((s) => s.workspaces);

  return useMemo(() => {
    if (!user || !board) return {};

    const workspace = board.workspace
      ? workspaces.find((w) => w._id.toString() === board.workspace.toString())
      : null;

    return resolvePermissions({
      userId: user._id.toString(),
      workspace,
      board,
      entity,
    });
  }, [user, board, workspaces, entity]);
};

export default usePermissions;
