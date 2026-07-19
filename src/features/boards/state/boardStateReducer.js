export const createEmptyBoardState = () => ({
  currentBoard: null,
  users: {},
  lists: {},
  cards: {},
  listOrder: [],
  boardMembers: [],
  joinRequests: [],
  activeUsers: [],
});

const updateCardInState = (state, cardId, update) => {
  const card = state.cards[cardId];
  if (!card) return state;
  return {
    ...state,
    cards: { ...state.cards, [cardId]: update(card) },
  };
};

/**
 * Pure reducer for the normalized working copy used by Board Context.
 * @param {import("../domain").NormalizedBoardState} state
 * @param {{ type: string, payload?: any }} action
 * @returns {import("../domain").NormalizedBoardState}
 */
export function boardStateReducer(state, { type, payload }) {
  switch (type) {
    case "reset":
      return payload;
    case "updateBoard":
      return {
        ...state,
        currentBoard: { ...state.currentBoard, ...payload },
      };
    case "addList": {
      const list = payload;
      return {
        ...state,
        lists: {
          ...state.lists,
          [list._id]: { ...list, cards: undefined, cardOrderIds: [] },
        },
        listOrder: [...state.listOrder, list._id],
      };
    }
    case "updateList": {
      const { listId, updates } = payload;
      if (!state.lists[listId]) return state;
      return {
        ...state,
        lists: {
          ...state.lists,
          [listId]: { ...state.lists[listId], ...updates },
        },
      };
    }
    case "removeList": {
      const { [payload]: removedList, ...lists } = state.lists;
      if (!removedList) return state;
      const cards = { ...state.cards };
      removedList.cardOrderIds?.forEach((cardId) => delete cards[cardId]);
      return {
        ...state,
        lists,
        cards,
        listOrder: state.listOrder.filter((id) => id !== payload),
      };
    }
    case "moveList": {
      const { activeId, overId } = payload;
      const listOrder = [...state.listOrder];
      const oldIndex = listOrder.indexOf(activeId);
      const newIndex = listOrder.indexOf(overId);
      if (oldIndex === -1 || newIndex === -1) return state;
      const [movedItem] = listOrder.splice(oldIndex, 1);
      listOrder.splice(newIndex, 0, movedItem);
      return { ...state, listOrder };
    }
    case "addCard": {
      const card = payload;
      const listId = card.listId || card.list;
      const list = state.lists[listId];
      return {
        ...state,
        cards: {
          ...state.cards,
          [card._id]: { ...card, list: listId, listId },
        },
        lists: list
          ? {
              ...state.lists,
              [listId]: {
                ...list,
                cardOrderIds: [...list.cardOrderIds, card._id],
              },
            }
          : state.lists,
      };
    }
    case "updateCard": {
      const { cardId, updates } = payload;
      return updateCardInState(state, cardId, (card) => ({
        ...card,
        ...updates,
      }));
    }
    case "removeCard": {
      const card = state.cards[payload];
      if (!card) return state;
      const { [payload]: _removedCard, ...cards } = state.cards;
      const listId = card.listId || card.list;
      const list = state.lists[listId];
      return {
        ...state,
        cards,
        lists: list
          ? {
              ...state.lists,
              [listId]: {
                ...list,
                cardOrderIds: list.cardOrderIds.filter((id) => id !== payload),
              },
            }
          : state.lists,
      };
    }
    case "moveCard":
      return moveCard(state, payload);
    case "updateListPosition": {
      const { listId, pos } = payload;
      if (!state.lists[listId]) return state;
      const lists = {
        ...state.lists,
        [listId]: { ...state.lists[listId], pos },
      };
      const listOrder = [...state.listOrder].sort(
        (a, b) => (lists[a]?.pos || 0) - (lists[b]?.pos || 0),
      );
      return { ...state, lists, listOrder };
    }
    case "updateCardPosition":
      return updateCardPosition(state, payload);
    case "addBoardMember": {
      const member = payload;
      if (state.boardMembers?.some((item) => item.user._id === member.user._id)) {
        return state;
      }
      const boardMembers = [...(state.boardMembers || []), member];
      return {
        ...state,
        boardMembers,
        currentBoard: { ...state.currentBoard, members: boardMembers },
      };
    }
    case "updateBoardMember": {
      const { memberId, updates } = payload;
      const boardMembers = state.boardMembers.map((member) =>
        member._id === memberId ? { ...member, ...updates } : member,
      );
      return {
        ...state,
        boardMembers,
        currentBoard: { ...state.currentBoard, members: boardMembers },
      };
    }
    case "removeBoardMember": {
      const boardMembers = state.boardMembers.filter(
        (member) => member._id !== payload,
      );
      return {
        ...state,
        boardMembers,
        currentBoard: { ...state.currentBoard, members: boardMembers },
      };
    }
    case "addJoinRequest":
      if (state.joinRequests?.some((request) => request._id === payload._id)) {
        return state;
      }
      return {
        ...state,
        joinRequests: [...(state.joinRequests || []), payload],
      };
    case "removeJoinRequest":
      return {
        ...state,
        joinRequests: state.joinRequests.filter(
          (request) => request._id !== payload,
        ),
      };
    case "addChecklistItem": {
      const { cardId, item } = payload;
      return updateCardInState(state, cardId, (card) => ({
        ...card,
        checklist: [...(card.checklist || []), item],
      }));
    }
    case "toggleChecklistItem": {
      const { cardId, item } = payload;
      return updateCardInState(state, cardId, (card) => ({
        ...card,
        checklist: (card.checklist || []).map((current) =>
          current._id === item._id ? item : current,
        ),
      }));
    }
    case "deleteChecklistItem": {
      const { cardId, itemId } = payload;
      return updateCardInState(state, cardId, (card) => ({
        ...card,
        checklist: (card.checklist || []).filter((item) => item._id !== itemId),
      }));
    }
    case "addAttachment": {
      const { cardId, attachment } = payload;
      return updateCardInState(state, cardId, (card) => ({
        ...card,
        attachments: [...(card.attachments || []), attachment],
        attachment_count: (card.attachment_count || 0) + 1,
      }));
    }
    case "deleteAttachment": {
      const { cardId, attachmentId } = payload;
      return updateCardInState(state, cardId, (card) => ({
        ...card,
        attachments: (card.attachments || []).filter(
          (attachment) => attachment._id !== attachmentId,
        ),
        attachment_count: Math.max(0, (card.attachment_count || 0) - 1),
      }));
    }
    case "assignCardMember":
      return assignCardMember(state, payload);
    case "removeCardMember": {
      const { cardId, userId } = payload;
      return updateCardInState(state, cardId, (card) => ({
        ...card,
        memberIds: (card.memberIds || []).filter((id) => id !== userId),
        _membersCache: (card._membersCache || []).filter(
          (member) => member._id !== userId,
        ),
      }));
    }
    case "updateUser":
      return updateUser(state, payload);
    case "setActiveUsers":
      return { ...state, activeUsers: payload };
    default:
      return state;
  }
}

function moveCard(state, { activeId, overId, activeListId, overListId }) {
  const sourceList = state.lists[activeListId];
  const destinationList = state.lists[overListId];
  if (!sourceList || !destinationList) return state;

  if (activeListId === overListId) {
    const cardOrderIds = [...sourceList.cardOrderIds];
    const oldIndex = cardOrderIds.indexOf(activeId);
    const newIndex = cardOrderIds.indexOf(overId);
    if (oldIndex === -1 || newIndex === -1) return state;
    const [movedCardId] = cardOrderIds.splice(oldIndex, 1);
    cardOrderIds.splice(newIndex, 0, movedCardId);
    return {
      ...state,
      lists: {
        ...state.lists,
        [activeListId]: { ...sourceList, cardOrderIds },
      },
    };
  }

  const sourceCardOrderIds = [...sourceList.cardOrderIds];
  const destinationCardOrderIds = [...destinationList.cardOrderIds];
  const oldIndex = sourceCardOrderIds.indexOf(activeId);
  if (oldIndex === -1) return state;
  let newIndex = destinationCardOrderIds.indexOf(overId);
  if (newIndex === -1) newIndex = destinationCardOrderIds.length;
  const [movedCardId] = sourceCardOrderIds.splice(oldIndex, 1);
  destinationCardOrderIds.splice(newIndex, 0, movedCardId);

  const movedCard = state.cards[movedCardId];
  return {
    ...state,
    lists: {
      ...state.lists,
      [activeListId]: { ...sourceList, cardOrderIds: sourceCardOrderIds },
      [overListId]: {
        ...destinationList,
        cardOrderIds: destinationCardOrderIds,
      },
    },
    cards: movedCard
      ? {
          ...state.cards,
          [movedCardId]: {
            ...movedCard,
            list: overListId,
            listId: overListId,
          },
        }
      : state.cards,
  };
}

function updateCardPosition(state, { cardId, targetListId, pos }) {
  const currentCard = state.cards[cardId];
  if (!currentCard) return state;
  const sourceListId = currentCard.listId || currentCard.list;
  const cards = {
    ...state.cards,
    [cardId]: {
      ...currentCard,
      listId: targetListId,
      list: targetListId,
      pos,
    },
  };
  const lists = { ...state.lists };

  if (lists[sourceListId] && sourceListId !== targetListId) {
    lists[sourceListId] = {
      ...lists[sourceListId],
      cardOrderIds: lists[sourceListId].cardOrderIds.filter(
        (id) => id !== cardId,
      ),
    };
  }

  if (lists[targetListId]) {
    const targetList = lists[targetListId];
    const cardOrderIds = targetList.cardOrderIds.filter((id) => id !== cardId);
    cardOrderIds.push(cardId);
    cardOrderIds.sort(
      (a, b) => (cards[a]?.pos || 0) - (cards[b]?.pos || 0),
    );
    lists[targetListId] = { ...targetList, cardOrderIds };
  }

  return { ...state, cards, lists };
}

function assignCardMember(state, { cardId, user }) {
  const card = state.cards[cardId];
  if (!card || card.memberIds?.includes(user._id)) return state;
  return {
    ...state,
    users: { ...state.users, [user._id]: user },
    cards: {
      ...state.cards,
      [cardId]: {
        ...card,
        memberIds: [...(card.memberIds || []), user._id],
        _membersCache: [...(card._membersCache || []), user],
      },
    },
  };
}

function updateUser(state, { userId, updates }) {
  const users = state.users[userId]
    ? {
        ...state.users,
        [userId]: { ...state.users[userId], ...updates },
      }
    : state.users;
  const cards = Object.fromEntries(
    Object.entries(state.cards).map(([cardId, card]) => [
      cardId,
      card.memberIds?.includes(userId)
        ? {
            ...card,
            _membersCache: card._membersCache.map((member) =>
              member._id === userId ? { ...member, ...updates } : member,
            ),
          }
        : card,
    ]),
  );
  return { ...state, users, cards };
}
