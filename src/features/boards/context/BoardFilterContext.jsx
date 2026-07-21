/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const BoardFilterContext = createContext(null);
const DEFAULT_FILTERS = {
  memberIds: [],
  labelNames: [],
  isOverdue: false,
  priority: null,
  isCompleted: null
};

export const BoardFilterProvider = ({ children, storageKey }) => {
  const [filters, setFilters] = useState(() => {
    if (!storageKey) return DEFAULT_FILTERS;
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      const candidate = saved?.filters;
      if (!candidate || !Array.isArray(candidate.memberIds)) return DEFAULT_FILTERS;
      return {
        memberIds: candidate.memberIds.filter((id) => typeof id === "string"),
        labelNames: Array.isArray(candidate.labelNames)
          ? candidate.labelNames.filter((name) => typeof name === "string")
          : [],
        isOverdue: candidate.isOverdue === true,
        priority: ["high", "medium", "low"].includes(candidate.priority) ? candidate.priority : null,
        isCompleted: typeof candidate.isCompleted === "boolean" ? candidate.isCompleted : null
      };
    } catch {
      return DEFAULT_FILTERS;
    }
  });

  useEffect(() => {
    if (!storageKey) return;
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey)) || {};
      localStorage.setItem(storageKey, JSON.stringify({ ...saved, filters }));
    } catch {
      // Filters still work for this session when storage is unavailable.
    }
  }, [filters, storageKey]);

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const toggleMemberFilter = (userId) => {
    setFilters(prev => ({
      ...prev,
      memberIds: prev.memberIds.includes(userId)
        ? prev.memberIds.filter(id => id !== userId)
        : [...prev.memberIds, userId]
    }));
  };

  const toggleLabelFilter = (labelName) => {
    setFilters(prev => ({
      ...prev,
      labelNames: prev.labelNames.includes(labelName)
        ? prev.labelNames.filter(name => name !== labelName)
        : [...prev.labelNames, labelName]
    }));
  };

  const setPriorityFilter = (priority) => {
    setFilters(prev => ({ ...prev, priority: prev.priority === priority ? null : priority }));
  };

  const toggleOverdueFilter = () => {
    setFilters(prev => ({ ...prev, isOverdue: !prev.isOverdue }));
  };

  const setCompletedFilter = (completed) => {
    setFilters(prev => ({ ...prev, isCompleted: prev.isCompleted === completed ? null : completed }));
  };

  const isFiltering = useMemo(() => {
    return filters.memberIds.length > 0 ||
           filters.labelNames.length > 0 ||
           filters.isOverdue || 
           filters.priority !== null || 
           filters.isCompleted !== null;
  }, [filters]);

  const value = {
    filters,
    setFilters,
    clearFilters,
    toggleMemberFilter,
    toggleLabelFilter,
    setPriorityFilter,
    toggleOverdueFilter,
    setCompletedFilter,
    isFiltering
  };

  return (
    <BoardFilterContext.Provider value={value}>
      {children}
    </BoardFilterContext.Provider>
  );
};

export const useBoardFilter = () => {
  const context = useContext(BoardFilterContext);
  if (!context) {
    throw new Error("useBoardFilter must be used within BoardFilterProvider");
  }
  return context;
};
