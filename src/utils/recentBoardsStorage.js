const RECENT_BOARDS_KEY = "trello_recent_boards";

export const getRecentBoards = () => {
  try {
    const data = localStorage.getItem(RECENT_BOARDS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const addRecentBoard = (board) => {
  if (!board || !board._id) return;
  try {
    const list = getRecentBoards();
    const filtered = list.filter((b) => b._id !== board._id);
    const updated = [
      {
        _id: board._id,
        title: board.title,
        color: board.color || "bg-primary",
        image: board.image || "",
        updatedAt: new Date().toISOString(),
      },
      ...filtered,
    ].slice(0, 6); // Keep top 6
    localStorage.setItem(RECENT_BOARDS_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage errors
  }
};
