import { create } from "zustand";

const useBoardDetailStore = create((set) => ({
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
