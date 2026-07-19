import { normalizeBoard } from "@/utils/boardUtils";
import { useCallback, useEffect, useReducer } from "react";
import {
  boardStateReducer,
  createEmptyBoardState,
} from "../state/boardStateReducer";

export const useBoardState = (initialBoardDetail) => {
  const [boardData, dispatch] = useReducer(
    boardStateReducer,
    undefined,
    createEmptyBoardState,
  );

  // React Query owns the server snapshot; context owns this normalized working copy.
  useEffect(() => {
    if (initialBoardDetail) {
      dispatch({ type: "reset", payload: normalizeBoard(initialBoardDetail) });
    }
  }, [initialBoardDetail]);

  const send = useCallback(
    (type, payload) => dispatch({ type, payload }),
    [],
  );

  const updateBoard = useCallback(
    (updates) => send("updateBoard", updates),
    [send],
  );
  const addList = useCallback((list) => send("addList", list), [send]);
  const updateList = useCallback(
    (listId, updates) => send("updateList", { listId, updates }),
    [send],
  );
  const removeList = useCallback(
    (listId) => send("removeList", listId),
    [send],
  );
  const moveList = useCallback(
    (activeId, overId) => send("moveList", { activeId, overId }),
    [send],
  );
  const updateListPosition = useCallback(
    (listId, pos) => send("updateListPosition", { listId, pos }),
    [send],
  );

  const addCard = useCallback((card) => send("addCard", card), [send]);
  const updateCard = useCallback(
    (cardId, updates) => send("updateCard", { cardId, updates }),
    [send],
  );
  const removeCard = useCallback(
    (cardId) => send("removeCard", cardId),
    [send],
  );
  const moveCard = useCallback(
    (activeId, overId, activeListId, overListId) =>
      send("moveCard", { activeId, overId, activeListId, overListId }),
    [send],
  );
  const updateCardPosition = useCallback(
    (cardId, targetListId, pos) =>
      send("updateCardPosition", { cardId, targetListId, pos }),
    [send],
  );

  const action = useCallback(
    (type, key, secondKey) => (first, second) =>
      send(type, secondKey
        ? { [key]: first, [secondKey]: second }
        : first),
    [send],
  );

  return {
    boardData,
    moveList,
    moveCard,
    addList,
    updateList,
    removeList,
    updateListPosition,
    addCard,
    updateCard,
    removeCard,
    updateCardPosition,
    addBoardMember: action("addBoardMember"),
    updateBoardMember: action("updateBoardMember", "memberId", "updates"),
    removeBoardMember: action("removeBoardMember"),
    addJoinRequest: action("addJoinRequest"),
    removeJoinRequest: action("removeJoinRequest"),
    addChecklistItem: action("addChecklistItem", "cardId", "item"),
    toggleChecklistItem: action("toggleChecklistItem", "cardId", "item"),
    deleteChecklistItem: action("deleteChecklistItem", "cardId", "itemId"),
    addAttachment: action("addAttachment", "cardId", "attachment"),
    deleteAttachment: action("deleteAttachment", "cardId", "attachmentId"),
    assignCardMember: action("assignCardMember", "cardId", "user"),
    removeCardMember: action("removeCardMember", "cardId", "userId"),
    updateUser: action("updateUser", "userId", "updates"),
    updateBoard,
    setActiveUsers: action("setActiveUsers"),
  };
};
