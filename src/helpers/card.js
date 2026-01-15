export const getChecklistProgress = (card) => {
  if (!card?.checklist?.length) return null;

  const total = card.checklist.length;
  const completed = card.checklist.filter((item) => item.completed).length;
  const percentage = Math.round((completed / total) * 100);

  return { completed, total, percentage };
};
