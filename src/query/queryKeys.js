const withId = (prefix, id) => [...prefix, id];

export const queryKeys = {
  boards: {
    all: ["boards"],
    archived: ["boards", "archived"],
    detail: (boardId) => ["board", boardId],
    workspaceLists: ["workspace-boards"],
    list: (workspaceId) => ["workspace-boards", workspaceId],
    members: (boardId) => ["board", boardId, "members"],
    joinRequests: (boardId) => ["board", boardId, "requests"],
  },
  workspaces: {
    all: ["workspaces"],
    list: () => ["workspaces", "list"],
    // Keep both existing detail namespaces until their response shapes converge.
    detail: (workspaceId) => ["workspace", workspaceId],
    mutationDetail: (workspaceId) => ["workspaces", "detail", workspaceId],
    joinRequests: (workspaceId) => [
      "workspaces",
      "members",
      "requests",
      workspaceId,
    ],
  },
  cards: {
    all: ["card"],
    detail: (cardId) => withId(["card"], cardId),
    comments: (cardId) => ["card", cardId, "comments"],
    attachments: (cardId) => ["card", cardId, "attachments"],
    replies: (commentId) => ["comment", commentId, "replies"],
  },
  notifications: {
    all: ["notifications"],
    list: () => ["notifications", "list"],
    unreadCount: () => ["notifications", "unread-count"],
  },
};

export const BOARD_KEYS = queryKeys.boards;
export const WORKSPACE_KEYS = queryKeys.workspaces;
export const WORKSPACES_KEYS = {
  all: queryKeys.workspaces.all,
  list: queryKeys.workspaces.list,
  detail: queryKeys.workspaces.mutationDetail,
};
export const CARD_KEYS = queryKeys.cards;
export const NOTIFICATION_KEYS = queryKeys.notifications;

export const REALTIME_QUERY_PREFIXES = [
  queryKeys.boards.all,
  ["board"],
  queryKeys.boards.workspaceLists,
  queryKeys.workspaces.all,
  ["workspace"],
  queryKeys.cards.all,
  queryKeys.notifications.all,
];
