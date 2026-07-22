import { describe, expect, it } from "vitest";

import { boardDndAnnouncements } from "./boardDndAccessibility";

const activeCard = {
  id: "c1",
  data: { current: { type: "card", title: "Viết README", listId: "l1" } },
};

const overList = {
  id: "l2",
  data: { current: { type: "card-container", listId: "l2", title: "Doing" } },
};

describe("boardDndAnnouncements", () => {
  it("announces drag start with card title", () => {
    expect(boardDndAnnouncements.onDragStart({ active: activeCard })).toContain(
      "thẻ Viết README",
    );
  });

  it("announces drag over a column", () => {
    expect(
      boardDndAnnouncements.onDragOver({ active: activeCard, over: overList }),
    ).toContain("cột Doing");
  });

  it("announces cancel", () => {
    expect(boardDndAnnouncements.onDragCancel({ active: activeCard })).toContain(
      "Đã hủy kéo",
    );
  });
});
