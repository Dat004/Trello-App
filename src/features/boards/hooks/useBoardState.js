import { normalizeBoard } from "@/utils/boardUtils";
import { useCallback, useEffect, useMemo, useReducer } from "react";
import {
  boardStateReducer,
  createEmptyBoardState,
} from "../state/boardStateReducer";

export const useBoardState = (initialBoardDetail) => {
  const [boardData, dispatch] = useReducer(
    boardStateReducer,
    initialBoardDetail,
    (detail) => (detail ? normalizeBoard(detail) : createEmptyBoardState()),
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
  const setCardOrder = useCallback(
    (payload) => send("setCardOrder", payload),
    [send],
  );

  const action = useCallback(
    (type, key, secondKey) => (first, second) =>
      send(type, secondKey
        ? { [key]: first, [secondKey]: second }
        : first),
    [send],
  );

  const addBoardMember = useMemo(() => action("addBoardMember"), [action]);
  const updateBoardMember = useMemo(
    () => action("updateBoardMember", "memberId", "updates"),
    [action],
  );
  const removeBoardMember = useMemo(() => action("removeBoardMember"), [action]);
  const addJoinRequest = useMemo(() => action("addJoinRequest"), [action]);
  const removeJoinRequest = useMemo(() => action("removeJoinRequest"), [action]);
  const addChecklistItem = useMemo(
    () => action("addChecklistItem", "cardId", "item"),
    [action],
  );
  const toggleChecklistItem = useMemo(
    () => action("toggleChecklistItem", "cardId", "item"),
    [action],
  );
  const deleteChecklistItem = useMemo(
    () => action("deleteChecklistItem", "cardId", "itemId"),
    [action],
  );
  const addAttachment = useMemo(
    () => action("addAttachment", "cardId", "attachment"),
    [action],
  );
  const deleteAttachment = useMemo(
    () => action("deleteAttachment", "cardId", "attachmentId"),
    [action],
  );
  const assignCardMember = useMemo(
    () => action("assignCardMember", "cardId", "user"),
    [action],
  );
  const removeCardMember = useMemo(
    () => action("removeCardMember", "cardId", "userId"),
    [action],
  );
  const addBoardLabel = useMemo(() => action("addBoardLabel"), [action]);
  const updateBoardLabel = useCallback(
    (labelId, label, meta) =>
      send("updateBoardLabel", { labelId, label, ...meta }),
    [send],
  );
  const removeBoardLabel = useCallback(
    (labelId, labelName) => send("removeBoardLabel", { labelId, labelName }),
    [send],
  );
  const assignCardLabel = useMemo(
    () => action("assignCardLabel", "cardId", "label"),
    [action],
  );
  const removeCardLabel = useMemo(
    () => action("removeCardLabel", "cardId", "labelId"),
    [action],
  );
  const updateUser = useMemo(
    () => action("updateUser", "userId", "updates"),
    [action],
  );
  const setActiveUsers = useMemo(() => action("setActiveUsers"), [action]);

  const actions = useMemo(
    () => ({
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
      setCardOrder,
      addBoardMember,
      updateBoardMember,
      removeBoardMember,
      addJoinRequest,
      removeJoinRequest,
      addChecklistItem,
      toggleChecklistItem,
      deleteChecklistItem,
      addAttachment,
      deleteAttachment,
      assignCardMember,
      removeCardMember,
      addBoardLabel,
      updateBoardLabel,
      removeBoardLabel,
      assignCardLabel,
      removeCardLabel,
      updateUser,
      updateBoard,
      setActiveUsers,
    }),
    [
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
      setCardOrder,
      addBoardMember,
      updateBoardMember,
      removeBoardMember,
      addJoinRequest,
      removeJoinRequest,
      addChecklistItem,
      toggleChecklistItem,
      deleteChecklistItem,
      addAttachment,
      deleteAttachment,
      assignCardMember,
      removeCardMember,
      addBoardLabel,
      updateBoardLabel,
      removeBoardLabel,
      assignCardLabel,
      removeCardLabel,
      updateUser,
      updateBoard,
      setActiveUsers,
    ],
  );

  return { boardData, actions };
};
