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
  const id = String(cardId);
  const card = state.cards[id];
  if (!card) return state;
  return {
    ...state,
    cards: { ...state.cards, [id]: update(card) },
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
      // Preserve presence across React Query refetches — normalizeBoard omits activeUsers.
      return {
        ...payload,
        activeUsers: state.activeUsers?.length
          ? state.activeUsers
          : payload.activeUsers || [],
      };
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
    case "setCardOrder":
      return setCardOrder(state, payload);
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
      return updateCardInState(state, cardId, (card) => {
        const attachmentId = String(attachment?._id || "");
        const already = (card.attachments || []).some(
          (item) => String(item._id) === attachmentId,
        );
        if (already) return card;
        return {
          ...card,
          attachments: [...(card.attachments || []), attachment],
          attachment_count: (card.attachment_count || 0) + 1,
        };
      });
    }
    case "deleteAttachment": {
      const { cardId, attachmentId } = payload;
      const attachmentKey = String(attachmentId);
      return updateCardInState(state, cardId, (card) => {
        const nextAttachments = (card.attachments || []).filter(
          (attachment) => String(attachment._id) !== attachmentKey,
        );
        // Prefer explicit count; fall back so card faces update even when
        // the board payload never hydrated an attachments array.
        const prevCount =
          typeof card.attachment_count === "number"
            ? card.attachment_count
            : (card.attachments || []).length;
        return {
          ...card,
          attachments: nextAttachments,
          attachment_count: Math.max(0, prevCount - 1),
        };
      });
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
    case "addBoardLabel": {
      const label = payload;
      const labels = state.currentBoard?.labels || [];
      if (labels.some((item) => item._id === label._id)) return state;
      const nextLabels = [...labels, label];
      return {
        ...state,
        currentBoard: { ...state.currentBoard, labels: nextLabels },
      };
    }
    case "updateBoardLabel": {
      const { labelId, label, oldName } = payload;
      const labels = (state.currentBoard?.labels || []).map((item) =>
        item._id === labelId ? { ...item, ...label } : item,
      );
      const matchName = oldName || label?.name;
      const cards = Object.fromEntries(
        Object.entries(state.cards).map(([cardId, card]) => [
          cardId,
          {
            ...card,
            labels: (card.labels || []).map((cardLabel) =>
              cardLabel.name === matchName
                ? { ...cardLabel, name: label.name, color: label.color }
                : cardLabel,
            ),
          },
        ]),
      );
      return {
        ...state,
        cards,
        currentBoard: { ...state.currentBoard, labels },
      };
    }
    case "removeBoardLabel": {
      const { labelId, labelName } = payload;
      const labels = (state.currentBoard?.labels || []).filter(
        (item) => item._id !== labelId,
      );
      const cards = Object.fromEntries(
        Object.entries(state.cards).map(([cardId, card]) => [
          cardId,
          {
            ...card,
            labels: (card.labels || []).filter(
              (cardLabel) => cardLabel.name !== labelName,
            ),
          },
        ]),
      );
      return {
        ...state,
        cards,
        currentBoard: { ...state.currentBoard, labels },
      };
    }
    case "assignCardLabel": {
      const { cardId, label } = payload;
      return updateCardInState(state, cardId, (card) => {
        if (card.labels?.some((item) => item._id === label._id || item.name === label.name)) {
          return card;
        }
        return {
          ...card,
          labels: [...(card.labels || []), label],
        };
      });
    }
    case "removeCardLabel": {
      const { cardId, labelId } = payload;
      return updateCardInState(state, cardId, (card) => ({
        ...card,
        labels: (card.labels || []).filter((item) => item._id !== labelId),
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
  const id = String(cardId);
  const targetId = String(targetListId);
  const currentCard = state.cards[id];
  if (!currentCard) return state;
  const sourceListId = String(currentCard.listId || currentCard.list || "");
  const cards = {
    ...state.cards,
    [id]: {
      ...currentCard,
      listId: targetId,
      list: targetId,
      pos,
    },
  };
  const lists = { ...state.lists };

  if (lists[sourceListId] && sourceListId !== targetId) {
    lists[sourceListId] = {
      ...lists[sourceListId],
      cardOrderIds: lists[sourceListId].cardOrderIds.filter(
        (cardOrderId) => String(cardOrderId) !== id,
      ),
    };
  }

  if (lists[targetId]) {
    const targetList = lists[targetId];
    const cardOrderIds = targetList.cardOrderIds.filter(
      (cardOrderId) => String(cardOrderId) !== id,
    );
    cardOrderIds.push(id);
    cardOrderIds.sort(
      (a, b) => (cards[a]?.pos || 0) - (cards[b]?.pos || 0),
    );
    lists[targetId] = { ...targetList, cardOrderIds };
  }

  return { ...state, cards, lists };
}

function setCardOrder(state, { listId, cardOrderIds, cardId, sourceListId }) {
  const targetListId = String(listId);
  const movedCardId = cardId ? String(cardId) : null;
  const fromListId = sourceListId ? String(sourceListId) : null;
  if (!state.lists[targetListId]) return state;

  let lists = { ...state.lists };
  let cards = state.cards;

  if (movedCardId && fromListId && fromListId !== targetListId && lists[fromListId]) {
    lists = {
      ...lists,
      [fromListId]: {
        ...lists[fromListId],
        cardOrderIds: lists[fromListId].cardOrderIds.filter(
          (id) => String(id) !== movedCardId,
        ),
      },
    };
  }

  lists = {
    ...lists,
    [targetListId]: {
      ...lists[targetListId],
      cardOrderIds: cardOrderIds.map(String),
    },
  };

  if (movedCardId && cards[movedCardId]) {
    cards = {
      ...cards,
      [movedCardId]: {
        ...cards[movedCardId],
        listId: targetListId,
        list: targetListId,
      },
    };
  }

  return { ...state, lists, cards };
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
