const paths = {
  home: "/",
  notifications: "/notifications",
  settings: "/settings/:step?",
  workspace: "/workspaces/:id",
  workspaces: "/workspaces",
  templates: "/templates",
  register: "/register",
  members: "/members",
  board: "/board/:id",
  boards: "/boards",
  login: "/login",
};

export const boardListPath = paths.boards;

export const boardDetailPath = (boardId, cardId) => {
  const pathname = `/board/${boardId}`;
  return cardId ? `${pathname}?card=${cardId}` : pathname;
};

export default paths;
