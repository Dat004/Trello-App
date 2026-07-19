import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { BoardFilterProvider, useBoardFilter } from "./BoardFilterContext";

function FilterHarness() {
  const {
    filters,
    isFiltering,
    toggleMemberFilter,
    setPriorityFilter,
    toggleOverdueFilter,
    clearFilters,
  } = useBoardFilter();

  return (
    <div>
      <output data-testid="filters">{JSON.stringify(filters)}</output>
      <output data-testid="active">{String(isFiltering)}</output>
      <button onClick={() => toggleMemberFilter("user-1")}>member</button>
      <button onClick={() => setPriorityFilter("high")}>priority</button>
      <button onClick={toggleOverdueFilter}>overdue</button>
      <button onClick={clearFilters}>clear</button>
    </div>
  );
}

const renderFilters = (storageKey = "board:test:filters") =>
  render(
    <BoardFilterProvider storageKey={storageKey}>
      <FilterHarness />
    </BoardFilterProvider>,
  );

describe("BoardFilterProvider", () => {
  it("restores valid filters and sanitizes unsafe persisted values", () => {
    localStorage.setItem(
      "board:test:filters",
      JSON.stringify({
        unrelated: "preserved",
        filters: {
          memberIds: ["user-1", 42],
          isOverdue: "yes",
          priority: "urgent",
          isCompleted: true,
        },
      }),
    );

    renderFilters();

    expect(screen.getByTestId("filters")).toHaveTextContent(
      JSON.stringify({
        memberIds: ["user-1"],
        isOverdue: false,
        priority: null,
        isCompleted: true,
      }),
    );
    expect(screen.getByTestId("active")).toHaveTextContent("true");
  });

  it("updates filter state through user interactions", async () => {
    const user = userEvent.setup();
    renderFilters();

    await user.click(screen.getByRole("button", { name: "member" }));
    await user.click(screen.getByRole("button", { name: "priority" }));
    await user.click(screen.getByRole("button", { name: "overdue" }));

    expect(screen.getByTestId("filters")).toHaveTextContent(
      JSON.stringify({
        memberIds: ["user-1"],
        isOverdue: true,
        priority: "high",
        isCompleted: null,
      }),
    );
    expect(screen.getByTestId("active")).toHaveTextContent("true");

    await user.click(screen.getByRole("button", { name: "clear" }));
    expect(screen.getByTestId("active")).toHaveTextContent("false");
  });

  it("persists filters without deleting sibling storage data", async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      "board:test:filters",
      JSON.stringify({ selectedView: "calendar" }),
    );
    renderFilters();

    await user.click(screen.getByRole("button", { name: "priority" }));

    await waitFor(() => {
      expect(JSON.parse(localStorage.getItem("board:test:filters"))).toEqual({
        selectedView: "calendar",
        filters: {
          memberIds: [],
          isOverdue: false,
          priority: "high",
          isCompleted: null,
        },
      });
    });
  });
});
