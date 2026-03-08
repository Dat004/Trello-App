import { useMemo } from 'react';
import { useBoardFilter } from '../context/BoardFilterContext';

export const useFilteredCards = (cardsArray) => {
  const { filters, isFiltering } = useBoardFilter();

  return useMemo(() => {
    if (!cardsArray) return [];
    if (!isFiltering) return cardsArray;

    return cardsArray.filter((card) => {
      if (!card) return false;

      // Lọc theo thành viên
      if (filters.memberIds.length > 0) {
        const cardMemberIds = card.memberIds || [];
        const hasMember = filters.memberIds.some((id) =>
          cardMemberIds.includes(id)
        );
        if (!hasMember) return false;
      }

      // Lọc theo độ ưu tiên
      if (filters.priority && card.priority !== filters.priority) {
        return false;
      }

      // Lọc theo hạn chót
      if (filters.isOverdue) {
        const isOverdue =
          card.due_date &&
          new Date(card.due_date) < new Date() &&
          !card.due_complete;
        if (!isOverdue) return false;
      }

      // Lọc theo trạng thái hoàn thành
      if (filters.isCompleted !== null) {
        if (!!card.due_complete !== filters.isCompleted) return false;
      }

      return true;
    });
  }, [cardsArray, filters, isFiltering]);
};
