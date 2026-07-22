/**
 * Pure selectors over normalized board working state.
 * Pair with `useBoardSelector` so UI only re-renders when the selected slice changes.
 *
 * @typedef {import("../domain").NormalizedBoardState} NormalizedBoardState
 */

/** @param {NormalizedBoardState} state */
export const selectBoardData = (state) => state;

/** @param {NormalizedBoardState} state */
export const selectCurrentBoard = (state) => state.currentBoard;

/** @param {NormalizedBoardState} state */
export const selectListOrder = (state) => state.listOrder;

/** @param {NormalizedBoardState} state */
export const selectLists = (state) => state.lists;

/** @param {NormalizedBoardState} state */
export const selectCards = (state) => state.cards;

/** @param {NormalizedBoardState} state */
export const selectUsers = (state) => state.users;

/** @param {NormalizedBoardState} state */
export const selectBoardMembers = (state) => state.boardMembers;

/** @param {NormalizedBoardState} state */
export const selectJoinRequests = (state) => state.joinRequests;

/** @param {NormalizedBoardState} state */
export const selectActiveUsers = (state) => state.activeUsers || [];

/** @param {NormalizedBoardState} state */
export const selectBoardLabels = (state) => state.currentBoard?.labels || [];

/**
 * @param {string} listId
 * @returns {(state: NormalizedBoardState) => import("../domain").BoardList | undefined}
 */
export const selectListById = (listId) => (state) => state.lists[listId];

/**
 * @param {string} cardId
 * @returns {(state: NormalizedBoardState) => import("../domain").BoardCard | undefined}
 */
export const selectCardById = (cardId) => (state) => state.cards[cardId];

/**
 * Ordered cards for a list (by that list's `cardOrderIds`).
 * @param {string} listId
 * @returns {(state: NormalizedBoardState) => import("../domain").BoardCard[]}
 */
export const selectCardsForList = (listId) => (state) => {
  const order = state.lists[listId]?.cardOrderIds || [];
  return order.map((id) => state.cards[id]).filter(Boolean);
};

/**
 * Identity used by realtime handlers to ignore duplicate entity patches.
 * Prefer `_id` + optional `updatedAt` when present.
 * @param {{ _id?: string, updatedAt?: string } | null | undefined} entity
 */
export const selectEntityIdentity = (entity) => {
  if (!entity?._id) return null;
  return entity.updatedAt ? `${entity._id}:${entity.updatedAt}` : entity._id;
};
