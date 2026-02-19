import { getMyRole } from "@/helpers/role";

export function resolvePermissions({
  userId,
  workspace,
  board,
  entity,
  workspaceMembers = [] // Add optional members arg
}) {
  const currentUserId = userId?.toString();

  const getBoardOwnerId = (b) => {
    if (!b || !b.owner) return null;
    return (b.owner?._id || b.owner).toString();
  };

  const getWsOwnerId = (w) => {
    if (!w || !w.owner) return null;
    return (w.owner?._id || w.owner).toString();
  };

  const boardOwnerId = getBoardOwnerId(board);
  const wsOwnerId = workspace ? getWsOwnerId(workspace) : null;

  const isBoardOwner = boardOwnerId === currentUserId;
  const isWsOwner = wsOwnerId === currentUserId;

  // Check from passed members or fallback to empty (removed store dependency)
  const isWsAdmin =
    workspace &&
    workspaceMembers.some(
      (m) => (m.user?._id || m.user).toString() === currentUserId && m.role === "admin"
    );

  // Board role
  const boardRole = board ? getMyRole(board.members) : null;
  const wsRole = workspace ? getMyRole(workspaceMembers) : null;
  const role = boardRole || wsRole;

  // Admin/Owner rights
  let canDelete = isBoardOwner || isWsOwner || isWsAdmin;

  // (Card / Comment / Attachment) Owner rights
  if (!canDelete && entity?.ownerId) {
    const entityOwnerId = (entity.ownerId?._id || entity.ownerId).toString();
    canDelete = entityOwnerId === currentUserId;
  }

  return {
    role,
    canDelete,
    isBoardOwner,
  };
}
