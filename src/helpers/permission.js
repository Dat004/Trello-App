import { getMyRole } from "@/helpers/role";
import { useWorkspaceStore } from "@/store";

export function resolvePermissions({
  userId,
  workspace,
  board,
  entity,
}) {
  const isBoardOwner = board.owner.toString() === userId;

  // Workspace members from store
  const workspaceMembers = workspace
    ? (useWorkspaceStore.getState().membersMap[workspace._id] || [])
    : [];

  // Workspace role
  const isWsOwner =
    workspace && workspace.owner.toString() === userId;

  const isWsAdmin =
    workspace &&
    workspaceMembers.some(
      (m) => (m.user?._id || m.user).toString() === userId && m.role === "admin"
    );

  // Board role
  const boardRole = getMyRole(board.members);
  const wsRole = workspace ? getMyRole(workspaceMembers) : null;
  const role = boardRole || wsRole;

  let canDelete = isBoardOwner || isWsOwner || isWsAdmin;

  // (Card / Comment / Attachment)
  if (!canDelete && entity?.ownerId) {
    canDelete = entity.ownerId.toString() === userId;
  }

  return {
    role,
    canDelete,
    isBoardOwner,
  };
}
