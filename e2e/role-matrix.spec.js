import { expect, test } from "@playwright/test";
import process from "node:process";

import { DEMO, loginAs } from "./helpers/auth";

const API_URL = process.env.E2E_API_URL || "http://127.0.0.1:5000";

async function getDemoBoard(context) {
  const boardsResponse = await context.request.get(`${API_URL}/api/boards`);
  expect(boardsResponse.ok()).toBeTruthy();

  const boardsBody = await boardsResponse.json();
  const board = boardsBody.data?.boards?.find(
    (candidate) => candidate.title === "Demo Board",
  );
  expect(board, "seeded Demo Board should exist").toBeTruthy();

  const detailResponse = await context.request.get(
    `${API_URL}/api/boards/${board._id}`,
  );
  expect(detailResponse.ok()).toBeTruthy();

  const detailBody = await detailResponse.json();
  const detail = detailBody.data;
  const toDoList = detail.board?.lists?.find((list) => list.title === "To Do");
  expect(toDoList, "seeded To Do list should exist").toBeTruthy();

  return {
    boardId: board._id,
    listId: toDoList._id,
    detail,
  };
}

test("owner can write while viewer stays read-only and receives realtime updates", async ({
  browser,
}) => {
  test.setTimeout(90_000);
  const ownerContext = await browser.newContext();
  const viewerContext = await browser.newContext();
  let createdCard;
  let boardId;
  let listId;

  try {
    const ownerPage = await ownerContext.newPage();
    const viewerPage = await viewerContext.newPage();

    await Promise.all([
      loginAs(ownerPage, DEMO.owner),
      loginAs(viewerPage, DEMO.viewer),
    ]);

    const ownerBoard = await getDemoBoard(ownerContext);
    const viewerBoard = await getDemoBoard(viewerContext);
    ({ boardId, listId } = ownerBoard);

    expect(viewerBoard.boardId).toBe(boardId);
    expect(ownerBoard.detail.read_only).toBe(false);
    expect(viewerBoard.detail.read_only).toBe(true);

    await Promise.all([
      ownerPage.goto(`/board/${boardId}`, { waitUntil: "domcontentloaded" }),
      viewerPage.goto(`/board/${boardId}`, { waitUntil: "domcontentloaded" }),
    ]);

    await Promise.all([
      expect(ownerPage.getByText("Demo Board", { exact: true })).toBeVisible({
        timeout: 20_000,
      }),
      expect(viewerPage.getByText("Demo Board", { exact: true })).toBeVisible({
        timeout: 20_000,
      }),
    ]);

    await expect(ownerPage.getByRole("button", { name: "Thêm danh sách" })).toBeVisible();
    await expect(ownerPage.getByRole("button", { name: "Thêm thẻ" }).first()).toBeVisible();
    await expect(viewerPage.getByRole("button", { name: "Thêm danh sách" })).toHaveCount(0);
    await expect(viewerPage.getByRole("button", { name: "Thêm thẻ" })).toHaveCount(0);

    const blockedResponse = await viewerContext.request.post(
      `${API_URL}/api/boards/${boardId}/lists/${listId}/cards/create`,
      {
        data: { title: "Viewer must not create this card" },
      },
    );
    expect(blockedResponse.status()).toBe(403);

    const cardTitle = `Role matrix realtime ${Date.now()}`;
    const createResponse = await ownerContext.request.post(
      `${API_URL}/api/boards/${boardId}/lists/${listId}/cards/create`,
      {
        data: { title: cardTitle },
      },
    );
    expect(createResponse.status()).toBe(201);
    createdCard = (await createResponse.json()).data.card;

    await expect(viewerPage.getByText(cardTitle, { exact: true })).toBeVisible({
      timeout: 15_000,
    });
  } finally {
    if (createdCard && boardId && listId) {
      await ownerContext.request.delete(
        `${API_URL}/api/boards/${boardId}/lists/${listId}/cards/${createdCard._id}`,
      );
    }
    await Promise.all([ownerContext.close(), viewerContext.close()]);
  }
});
