import { useMemo, useState } from "react";

export function useBoardSort(boards = [], favoriteBoards = []) {
  const [sortBy, setSortBy] = useState("recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStarred, setFilterStarred] = useState(false);

  const sortedAndFilteredBoards = useMemo(() => {
    // Add is_starred property to each board
    let result = boards.map((board) => ({
      ...board,
      is_starred: favoriteBoards.some((fav) => fav._id === board._id),
    }));

    // Filter by starred
    if (filterStarred) {
      result = result.filter((board) => board.is_starred);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((board) => board.title?.toLowerCase().includes(q));
    }

    // Sort boards
    result.sort((a, b) => {
      switch (sortBy) {
        case "starred":
          if (a.is_starred !== b.is_starred) {
            return a.is_starred ? -1 : 1;
          }
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        case "az":
          return (a.title || "").localeCompare(b.title || "", "vi");
        case "za":
          return (b.title || "").localeCompare(a.title || "", "vi");
        case "oldest":
          return new Date(a.created_at || 0) - new Date(b.created_at || 0);
        case "recent":
        default:
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      }
    });

    return result;
  }, [boards, favoriteBoards, filterStarred, searchQuery, sortBy]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setFilterStarred(false);
    setSortBy("recent");
  };

  return {
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    filterStarred,
    setFilterStarred,
    sortedAndFilteredBoards,
    handleClearFilters,
  };
}
