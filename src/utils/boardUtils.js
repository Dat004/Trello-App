export const normalizeBoard = (inputData) => {
  if (!inputData) {
    return {
      currentBoard: null,
      users: {},
      lists: {},
      cards: {},
      listOrder: [],
      boardMembers: [],
      joinRequests: []
    };
  }

  const boardDetail = inputData.board || inputData;

  const lists = {};
  const cards = {};
  const users = {};
  const listOrder = [];

  const rawLists = boardDetail.lists || [];

  rawLists.forEach(list => {
    listOrder.push(list._id);

    const cardOrderIds = [];
    const rawCards = list.cards || [];

    rawCards.forEach(card => {
      const memberIds = [];
      const membersCache = [];

      if (card.members && Array.isArray(card.members)) {
        card.members.forEach(member => {
          users[member._id] = member;

          memberIds.push(member._id);
          membersCache.push(member);
        });
      }

      // Normalize card data
      cards[card._id] = {
        ...card,
        listId: list._id,
        memberIds,
        _membersCache: membersCache,
        members: undefined
      };

      cardOrderIds.push(card._id);
    });
    lists[list._id] = {
      ...list,
      cardOrderIds: cardOrderIds,
      cards: undefined
    };
  });
  const boardMembers = boardDetail.members || [];
  const joinRequests = boardDetail.joinRequests || boardDetail.join_requests || [];

  const currentBoard = { ...boardDetail };

  if (inputData.board) {
    const { board, ...extras } = inputData;
    Object.assign(currentBoard, extras);
  }

  delete currentBoard.lists;
  delete currentBoard.cards;

  return {
    currentBoard,
    users,
    lists,
    cards,
    listOrder,
    boardMembers,
    joinRequests
  };
};
