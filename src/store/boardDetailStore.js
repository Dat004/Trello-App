import { create } from "zustand";

const useBoardDetailStore = create((set, get) => ({
  currentBoard: null,
  lists: {},
  cards: {},
  listOrder: [],
  isLoading: true,

  setCurrentBoard: (boardDetail) => {
    const listsMap = {};
    const cardsMap = {};
    const listOrderIds = [];

    if (boardDetail.lists && Array.isArray(boardDetail.lists)) {
      boardDetail.lists?.forEach((list) => {
        // 1. Lưu thứ tự List
        listOrderIds.push(list._id);

        // 2. Tách Cards ra khỏi List
        const cardOrderIds = [];
        if (list.cards && Array.isArray(list.cards)) {
          list.cards?.forEach((card) => {
            // Lưu card vào map cards
            cardsMap[card._id] = { ...card, list: list._id };
            // Lưu thứ tự card trong list này
            cardOrderIds.push(card._id);
          });
        }

        // 3. Lưu List vào map lisrs
        listsMap[list._id] = {
          ...list,
          cards: undefined, // Xóa dữ liệu thừa
          cardOrderIds: cardOrderIds,
        };
      });
    }

    set({
      currentBoard: boardDetail,
      lists: listsMap,
      cards: cardsMap,
      listOrder: listOrderIds,
      isLoading: false,
    });
  },

  // List
  addList: (list) => {
    set((state) => {
      const newLists = { ...state.lists };
      const newListOrder = [...state.listOrder, list._id];

      // List mới
      newLists[list._id] = {
        ...list,
        cards: undefined,
        cardOrderIds: [],
      };

      // Cập nhật currentBoard với list mới
      const updatedBoard = {
        ...state.currentBoard,
        lists: [...state.currentBoard?.lists, list],
      };

      return {
        currentBoard: updatedBoard,
        lists: newLists,
        listOrder: newListOrder,
      };
    });
  },

  updateList: (listId, updatedData) => {
    set((state) => {
      const newLists = { ...state.lists };
      const currentList = newLists[listId];

      if (!currentList) return state;

      // Cập nhật list
      const updatedList = { ...currentList, ...updatedData };
      newLists[listId] = updatedList;

      // Cập nhật currentBoard
      const updatedBoard = {
        ...state.currentBoard,
        lists: state.currentBoard.lists?.map((list) =>
          list._id === listId ? updatedList : list
        ),
      };

      return {
        currentBoard: updatedBoard,
        lists: newLists,
      };
    });
  },

  removeList: (listId) => {
    set((state) => {
      const newLists = { ...state.lists };
      const newCards = { ...state.cards };
      const newListOrder = state.listOrder.filter((id) => id !== listId);

      // Xóa tất cả card trong list
      const listToRemove = newLists[listId];
      if (listToRemove) {
        listToRemove.cardOrderIds?.forEach((cardId) => {
          delete newCards[cardId];
        });
      }

      // Xóa list khỏi store
      delete newLists[listId];

      // Cập nhật currentBoard
      const updatedBoard = {
        ...state.currentBoard,
        lists: state.currentBoard.lists?.filter((list) => list._id !== listId),
      };

      return {
        currentBoard: updatedBoard,
        lists: newLists,
        cards: newCards,
        listOrder: newListOrder,
      };
    });
  },

  moveList: (activeId, overId) => {
    set((state) => {
      const { listOrder } = state;
      const oldIndex = listOrder.indexOf(activeId);
      const newIndex = listOrder.indexOf(overId);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newListOrder = [...listOrder];
        const [movedItem] = newListOrder.splice(oldIndex, 1);
        newListOrder.splice(newIndex, 0, movedItem);

        return { listOrder: newListOrder };
      }

      return state;
    });
  },

  // Card
  addCard: (card) => {
    set((state) => {
      const newCards = { ...state.cards };
      newCards[card._id] = card;

      // Cập nhật list chứa card
      const listId = card.list;
      const newLists = { ...state.lists };
      const targetList = newLists[listId];

      if (targetList) {
        const updatedCardOrderIds = [...targetList.cardOrderIds, card._id];
        newLists[listId] = {
          ...targetList,
          cardOrderIds: updatedCardOrderIds,
        };
      }

      return {
        cards: newCards,
        lists: newLists,
      };
    });
  },

  updateCard: (cardId, updatedData) => {
    set((state) => {
      const newCards = { ...state.cards };
      const currentCard = newCards[cardId];

      if (!currentCard) return state;

      // Cập nhật card
      const updatedCard = { ...currentCard, ...updatedData };
      newCards[cardId] = updatedCard;

      return {
        cards: newCards,
      };
    });
  },

  removeCard: (cardId) => {
    set((state) => {
      const newCards = { ...state.cards };
      const cardToRemove = newCards[cardId];
      if (!cardToRemove) return state;

      const listId = cardToRemove.list;

      // Xóa card khỏi store
      delete newCards[cardId];

      // Cập nhật list chứa card
      const newLists = { ...state.lists };
      const targetList = newLists[listId];
      if (targetList) {
        const updatedCardOrderIds = targetList.cardOrderIds.filter(
          (id) => id !== cardId
        );
        newLists[listId] = {
          ...targetList,
          cardOrderIds: updatedCardOrderIds,
        };
      }

      return {
        cards: newCards,
        lists: newLists,
      };
    });
  },

  moveCard: (activeId, overId, activeListId, overListId) => {
    set((state) => {
      const { lists, cards } = state;
      const newLists = { ...lists };

      // 1. Trường hợp cùng List
      if (activeListId === overListId) {
        const targetList = newLists[activeListId];
        const oldIndex = targetList.cardOrderIds.indexOf(activeId);
        const newIndex = targetList.cardOrderIds.indexOf(overId);

        if (oldIndex !== -1 && newIndex !== -1) {
          const newCardOrderIds = [...targetList.cardOrderIds];
          const [movedCardId] = newCardOrderIds.splice(oldIndex, 1);
          newCardOrderIds.splice(newIndex, 0, movedCardId);

          newLists[activeListId] = {
            ...targetList,
            cardOrderIds: newCardOrderIds,
          };
        }
        return { lists: newLists };
      }

      // 2. Trường hợp khác List
      const sourceList = newLists[activeListId];
      const destList = newLists[overListId];

      if (sourceList && destList) {
        const sourceCardOrderIds = [...sourceList.cardOrderIds];
        const destCardOrderIds = [...destList.cardOrderIds];

        const oldIndex = sourceCardOrderIds.indexOf(activeId);
        // Nếu overId không tồn tại chèn vào cuối
        let newIndex = destCardOrderIds.indexOf(overId);
        if (newIndex === -1) newIndex = destCardOrderIds.length;

        if (oldIndex !== -1) {
          const [movedCardId] = sourceCardOrderIds.splice(oldIndex, 1);
          destCardOrderIds.splice(newIndex, 0, movedCardId);

          // Cập nhật mapping cards
          const newCards = { ...cards };
          if (newCards[movedCardId]) {
            newCards[movedCardId] = { ...newCards[movedCardId], list: overListId };
          }

          newLists[activeListId] = { ...sourceList, cardOrderIds: sourceCardOrderIds };
          newLists[overListId] = { ...destList, cardOrderIds: destCardOrderIds };

          return { lists: newLists, cards: newCards };
        }
      }

      return state;
    });
  },

  // Checklist
  addChecklistItem: (cardId, item) => {
    set((state) => {
      const newCards = { ...state.cards };
      const currentCard = newCards[cardId];

      if (!currentCard) return state;

      // Thêm item mới vào checklist
      const updatedChecklist = [...(currentCard.checklist || []), item];
      const updatedCard = {
        ...currentCard,
        checklist: updatedChecklist,
      };
      newCards[cardId] = updatedCard;

      return {
        cards: newCards,
      };
    });
  },

  toggleChecklistItem: (cardId, updatedItem) => {
    set((state) => {
      const newCards = { ...state.cards };
      const currentCard = newCards[cardId];

      if (!currentCard) return state;

      // Toggle completed status của item
      const updatedChecklist = currentCard.checklist.map((item) =>
        item._id === updatedItem._id ? { ...item, ...updatedItem } : item
      );
      const updatedCard = {
        ...currentCard,
        checklist: updatedChecklist,
      };
      newCards[cardId] = updatedCard;

      return {
        cards: newCards,
      };
    });
  },

  deleteChecklistItem: (cardId, itemId) => {
    set((state) => {
      const newCards = { ...state.cards };
      const currentCard = newCards[cardId];

      if (!currentCard) return state;

      // Xóa item khỏi checklist
      const updatedChecklist = currentCard.checklist.filter(
        (item) => item._id !== itemId
      );
      const updatedCard = {
        ...currentCard,
        checklist: updatedChecklist,
      };
      newCards[cardId] = updatedCard;

      return {
        cards: newCards,
      };
    });
  },

  // SOCKET REALTIME ACTIONS
  addCommentFromSocket: (cardId) => {
    set((state) => {
      const newCards = { ...state.cards };
      const currentCard = newCards[cardId];

      if (!currentCard) return state;

      // Tăng comment_count
      const updatedCard = {
        ...currentCard,
        comment_count: (currentCard.comment_count || 0) + 1,
      };
      newCards[cardId] = updatedCard;

      return {
        cards: newCards,
      };
    });
  },

  removeCommentFromSocket: (cardId) => {
    set((state) => {
      const newCards = { ...state.cards };
      const currentCard = newCards[cardId];

      if (!currentCard) return state;

      // Giảm comment_count
      const updatedCard = {
        ...currentCard,
        comment_count: Math.max((currentCard.comment_count || 1) - 1, 0),
      };
      newCards[cardId] = updatedCard;

      return {
        cards: newCards,
      };
    });
  },

  moveListFromSocket: (data) => {
    const { listId, pos } = data;

    set((state) => {
      const newLists = { ...state.lists };
      const currentList = newLists[listId];

      if (!currentList) return state;

      const updatedList = {
        ...currentList,
        pos: pos,
      }

      newLists[listId] = updatedList;

      return {
        lists: newLists,
        listOrder: state.listOrder.sort((a, b) => newLists[a].pos - newLists[b].pos),
      };
    });
  },

  addListFromSocket: (data) => {
    const { list } = data;
    get().addList(list);
  },

  updateListFromSocket: (data) => {
    const { listId, list: updatedData } = data;
    get().updateList(listId, updatedData);
  },

  deleteListFromSocket: (data) => {
    const { listId } = data;
    get().removeList(listId);
  },

  // Card/List Movement from Socket
  moveCardFromSocket: (data) => {
    const { cardId, sourceListId, targetListId, pos } = data;

    set((state) => {
      const newLists = { ...state.lists };
      const newCards = { ...state.cards };
      const currentCard = newCards[cardId];

      if (!currentCard) return state;

      newCards[cardId] = {
        ...currentCard,
        pos: pos,
      };

      if (sourceListId !== targetListId) {
        const sourceList = newLists[sourceListId];
        newLists[sourceListId] = {
          ...sourceList,
          cardOrderIds: sourceList.cardOrderIds.filter(id => id !== cardId),
        };
      }

      const targetList = newLists[targetListId];
      const newCardIds = sourceListId === targetListId
        ? targetList.cardOrderIds
        : [...targetList.cardOrderIds, cardId];

      newLists[targetListId] = {
        ...targetList,
        cardOrderIds: newCardIds.sort((a, b) => newCards[a].pos - newCards[b].pos),
      };

      return {
        lists: newLists,
        cards: newCards,
      };
    });
  },

  // Card Info Updates from Socket
  updateCardFromSocket: (data) => {
    const { cardId, updates } = data;

    set((state) => {
      const newCards = { ...state.cards };
      const currentCard = newCards[cardId];

      if (!currentCard) return state;

      newCards[cardId] = {
        ...currentCard,
        ...updates,
      };

      return { cards: newCards };
    });
  },

  // Checklist from Socket
  addChecklistItemFromSocket: (data) => {
    const { cardId, checklist } = data;

    set((state) => {
      const newCards = { ...state.cards };
      const currentCard = newCards[cardId];

      if (!currentCard) return state;

      const updatedChecklist = [...(currentCard.checklist || []), checklist];
      newCards[cardId] = {
        ...currentCard,
        checklist: updatedChecklist,
      };

      return { cards: newCards };
    });
  },

  toggleChecklistItemFromSocket: (data) => {
    const { cardId, checklist } = data;

    set((state) => {
      const newCards = { ...state.cards };
      const currentCard = newCards[cardId];

      if (!currentCard) return state;

      const updatedChecklist = currentCard.checklist.map((item) =>
        item._id === checklist._id ? { ...item, ...checklist } : item
      );
      newCards[cardId] = {
        ...currentCard,
        checklist: updatedChecklist,
      };

      return { cards: newCards };
    });
  },

  deleteChecklistItemFromSocket: (data) => {
    const { cardId, checklistId } = data;

    set((state) => {
      const newCards = { ...state.cards };
      const currentCard = newCards[cardId];

      if (!currentCard) return state;

      const updatedChecklist = currentCard.checklist.filter(
        (item) => item._id !== checklistId
      );
      newCards[cardId] = {
        ...currentCard,
        checklist: updatedChecklist,
      };

      return { cards: newCards };
    });
  },

  // Reset store
  reset: () =>
    set({
      currentBoard: null,
      lists: {},
      cards: {},
      listOrder: [],
      isLoading: true,
    }),
}));

export default useBoardDetailStore;
