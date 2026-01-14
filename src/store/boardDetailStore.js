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
      boardDetail.lists.forEach((list) => {
        // 1. Lưu thứ tự List
        listOrderIds.push(list._id);

        // 2. Tách Cards ra khỏi List
        const cardOrderIds = [];
        if (list.cards && Array.isArray(list.cards)) {
          list.cards.forEach((card) => {
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
