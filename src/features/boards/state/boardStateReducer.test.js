import { describe, expect, it } from "vitest";

import { normalizeBoard } from "@/utils/boardUtils";
import {
  boardStateReducer,
  createEmptyBoardState,
} from "./boardStateReducer";

const boardFixture = {
  board: {
    _id: "board-1",
    title: "Portfolio board",
    members: [{ _id: "membership-1", user: { _id: "user-1" } }],
    join_requests: [{ _id: "request-1" }],
    lists: [
      {
        _id: "list-1",
        title: "Todo",
        cards: [
          {
            _id: "card-1",
            title: "Ship tests",
            pos: 10,
            members: [{ _id: "user-1", full_name: "Ada" }],
          },
        ],
      },
      { _id: "list-2", title: "Done", cards: [] },
    ],
  },
  canEdit: true,
};

describe("normalizeBoard", () => {
  it("returns a safe empty shape for missing data", () => {
    expect(normalizeBoard()).toEqual({
      currentBoard: null,
      users: {},
      lists: {},
      cards: {},
      listOrder: [],
      boardMembers: [],
      joinRequests: [],
    });
  });

  it("normalizes nested lists, cards, members, and envelope metadata", () => {
    const state = normalizeBoard(boardFixture);

    expect(state.listOrder).toEqual(["list-1", "list-2"]);
    expect(state.lists["list-1"]).toMatchObject({
      title: "Todo",
      cardOrderIds: ["card-1"],
      cards: undefined,
    });
    expect(state.cards["card-1"]).toMatchObject({
      listId: "list-1",
      memberIds: ["user-1"],
      members: undefined,
    });
    expect(state.users["user-1"].full_name).toBe("Ada");
    expect(state.currentBoard).toMatchObject({
      _id: "board-1",
      canEdit: true,
    });
    expect(state.currentBoard).not.toHaveProperty("lists");
    expect(state.joinRequests).toEqual([{ _id: "request-1" }]);
  });
});

describe("boardStateReducer", () => {
  it("adds a normalized list without mutating the previous state", () => {
    const state = createEmptyBoardState();
    const next = boardStateReducer(state, {
      type: "addList",
      payload: { _id: "list-1", title: "Todo", cards: [{ _id: "ignored" }] },
    });

    expect(next).not.toBe(state);
    expect(state.listOrder).toEqual([]);
    expect(next.listOrder).toEqual(["list-1"]);
    expect(next.lists["list-1"]).toMatchObject({ cards: undefined, cardOrderIds: [] });
  });

  it("adds and removes a card while keeping list order consistent", () => {
    const base = normalizeBoard(boardFixture);
    const added = boardStateReducer(base, {
      type: "addCard",
      payload: { _id: "card-2", title: "Review", list: "list-1" },
    });
    const removed = boardStateReducer(added, {
      type: "removeCard",
      payload: "card-1",
    });

    expect(added.cards["card-2"]).toMatchObject({
      list: "list-1",
      listId: "list-1",
    });
    expect(added.lists["list-1"].cardOrderIds).toEqual(["card-1", "card-2"]);
    expect(removed.cards["card-1"]).toBeUndefined();
    expect(removed.lists["list-1"].cardOrderIds).toEqual(["card-2"]);
  });

  it("moves a card across lists and updates both list references", () => {
    const state = normalizeBoard(boardFixture);
    const next = boardStateReducer(state, {
      type: "moveCard",
      payload: {
        activeId: "card-1",
        overId: "missing-target",
        activeListId: "list-1",
        overListId: "list-2",
      },
    });

    expect(next.lists["list-1"].cardOrderIds).toEqual([]);
    expect(next.lists["list-2"].cardOrderIds).toEqual(["card-1"]);
    expect(next.cards["card-1"]).toMatchObject({ list: "list-2", listId: "list-2" });
  });

  it("removes a list and all cards owned by it", () => {
    const state = normalizeBoard(boardFixture);
    const next = boardStateReducer(state, {
      type: "removeList",
      payload: "list-1",
    });

    expect(next.lists["list-1"]).toBeUndefined();
    expect(next.cards["card-1"]).toBeUndefined();
    expect(next.listOrder).toEqual(["list-2"]);
  });

  it("ignores unknown entities and unknown actions by reference", () => {
    const state = normalizeBoard(boardFixture);

    expect(
      boardStateReducer(state, {
        type: "updateCard",
        payload: { cardId: "missing", updates: { title: "No-op" } },
      }),
    ).toBe(state);
    expect(boardStateReducer(state, { type: "unknown" })).toBe(state);
  });

  it("deduplicates assigned card members", () => {
    const state = normalizeBoard(boardFixture);
    const duplicate = boardStateReducer(state, {
      type: "assignCardMember",
      payload: { cardId: "card-1", user: { _id: "user-1", full_name: "Ada" } },
    });
    const next = boardStateReducer(state, {
      type: "assignCardMember",
      payload: { cardId: "card-1", user: { _id: "user-2", full_name: "Grace" } },
    });

    expect(duplicate).toBe(state);
    expect(next.cards["card-1"].memberIds).toEqual(["user-1", "user-2"]);
    expect(next.users["user-2"].full_name).toBe("Grace");
  });
});
