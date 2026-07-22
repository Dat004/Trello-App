/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo } from "react";

import { useBoardState } from "../hooks/useBoardState";

const BoardDataContext = createContext(null);
const BoardActionsContext = createContext(null);

export const BoardStateProvider = ({ serverBoard, children }) => {
  const { boardData, actions } = useBoardState(serverBoard);

  return (
    <BoardDataContext.Provider value={boardData}>
      <BoardActionsContext.Provider value={actions}>
        {children}
      </BoardActionsContext.Provider>
    </BoardDataContext.Provider>
  );
};

/**
 * Stable mutation API — does not re-render when board maps change.
 * @param {boolean} [required=true]
 */
export const useBoardActions = (required = true) => {
  const actions = useContext(BoardActionsContext);
  if (!actions && required) {
    throw new Error("useBoardActions must be used within BoardStateProvider");
  }
  return actions;
};

/**
 * Read a slice of normalized board state.
 * Re-renders when board data changes; prefer over `useBoardContext` when you
 * only need a slice. Mutation hooks should use `useBoardActions` instead.
 * @template T
 * @param {(state: import("../domain").NormalizedBoardState) => T} selector
 * @param {boolean} [required=true]
 * @returns {T | undefined}
 */
export const useBoardSelector = (selector, required = true) => {
  const boardData = useContext(BoardDataContext);
  if (!boardData && required) {
    throw new Error("useBoardSelector must be used within BoardStateProvider");
  }
  return useMemo(
    () => (boardData ? selector(boardData) : undefined),
    [boardData, selector],
  );
};

/**
 * Full board context (data + actions). Prefer `useBoardSelector` /
 * `useBoardActions` in new code so mutation hooks skip data subscriptions.
 * @param {boolean} [required=true]
 */
export const useBoardContext = (required = true) => {
  const boardData = useContext(BoardDataContext);
  const actions = useContext(BoardActionsContext);
  if ((!boardData || !actions) && required) {
    throw new Error("useBoardContext must be used within BoardStateProvider");
  }
  if (!boardData || !actions) return null;
  return useMemo(() => ({ boardData, ...actions }), [boardData, actions]);
};
