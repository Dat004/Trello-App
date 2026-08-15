import { useMemo, useState } from "react";

const PRIORITY_RANK = {
  high: 3,
  medium: 2,
  low: 1,
};

export function useTableSort(cards = []) {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSort = (columnKey) => {
    if (sortColumn === columnKey) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  const sortedCards = useMemo(() => {
    if (!sortColumn) return cards;

    const listCopy = [...cards];
    listCopy.sort((a, b) => {
      let valA = a[sortColumn];
      let valB = b[sortColumn];

      if (sortColumn === "priority") {
        valA = PRIORITY_RANK[a.priority] || 0;
        valB = PRIORITY_RANK[b.priority] || 0;
      } else if (sortColumn === "due_date") {
        valA = a.due_date ? new Date(a.due_date).getTime() : 0;
        valB = b.due_date ? new Date(b.due_date).getTime() : 0;
      } else if (typeof valA === "string") {
        valA = valA.toLowerCase();
        valB = (valB || "").toLowerCase();
      }

      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return listCopy;
  }, [cards, sortColumn, sortDirection]);

  return {
    sortColumn,
    sortDirection,
    handleSort,
    sortedCards,
  };
}
