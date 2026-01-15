import { getMyRole } from "@/helpers/role";

export function resolvePermissions({
  userId,
  workspace,
  board,
  entity,
}) {
  const isBoardOwner = board.owner.toString() === userId;

  // Workspace role
  const isWsOwner =
    workspace && workspace.owner.toString() === userId;

  const isWsAdmin =
    workspace &&
    workspace.members.some(
      (m) => m.user.toString() === userId && m.role === "admin"
    );

  // Board role
  const boardRole = getMyRole(board.members);
  const wsRole = workspace ? getMyRole(workspace.members) : null;
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
