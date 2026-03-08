import { createContext, useContext, useMemo, useState } from 'react';

const BoardFilterContext = createContext(null);

export const BoardFilterProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    memberIds: [],
    isOverdue: false,
    priority: null, // high | medium | low
    isCompleted: null // true | false
  });

  const clearFilters = () => {
    setFilters({
      memberIds: [],
      isOverdue: false,
      priority: null,
      isCompleted: null
    });
  };

  const toggleMemberFilter = (userId) => {
    setFilters(prev => ({
      ...prev,
      memberIds: prev.memberIds.includes(userId)
        ? prev.memberIds.filter(id => id !== userId)
        : [...prev.memberIds, userId]
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
           filters.isOverdue || 
           filters.priority !== null || 
           filters.isCompleted !== null;
  }, [filters]);

  const value = {
    filters,
    setFilters,
    clearFilters,
    toggleMemberFilter,
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
