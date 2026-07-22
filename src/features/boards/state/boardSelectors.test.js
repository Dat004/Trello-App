import { describe, expect, it } from "vitest";

import {
  selectCardById,
  selectCardsForList,
  selectCurrentBoard,
  selectEntityIdentity,
  selectListOrder,
} from "./boardSelectors";

const sampleState = {
  currentBoard: { _id: "b1", title: "Demo", labels: [{ _id: "l1", name: "Bug" }] },
  users: {},
  lists: {
    list1: { _id: "list1", title: "To Do", cardOrderIds: ["c2", "c1"] },
  },
  cards: {
    c1: { _id: "c1", title: "First", listId: "list1" },
    c2: { _id: "c2", title: "Second", listId: "list1" },
  },
  listOrder: ["list1"],
  boardMembers: [],
  joinRequests: [],
  activeUsers: [],
};

describe("boardSelectors", () => {
  it("selects current board and list order", () => {
    expect(selectCurrentBoard(sampleState)?._id).toBe("b1");
    expect(selectListOrder(sampleState)).toEqual(["list1"]);
  });

  it("selects a card by id", () => {
    expect(selectCardById("c1")(sampleState)?.title).toBe("First");
    expect(selectCardById("missing")(sampleState)).toBeUndefined();
  });

  it("returns cards for a list in cardOrderIds order", () => {
    expect(selectCardsForList("list1")(sampleState).map((c) => c._id)).toEqual([
      "c2",
      "c1",
    ]);
  });

  it("builds entity identity for realtime dedupe", () => {
    expect(selectEntityIdentity({ _id: "c1" })).toBe("c1");
    expect(selectEntityIdentity({ _id: "c1", updatedAt: "t1" })).toBe("c1:t1");
    expect(selectEntityIdentity(null)).toBeNull();
  });
});
