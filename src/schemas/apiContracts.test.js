import { describe, expect, it } from "vitest";

import {
  authUserDataContract,
  boardDetailContract,
  cardMutationDataContract,
  notificationsPageContract,
  uploadSignatureContract,
} from "./apiContracts";

describe("apiContracts", () => {
  it("accepts a board detail envelope with identity fields", () => {
    const parsed = boardDetailContract.safeParse({
      board: { _id: "b1", title: "Demo", lists: [] },
      is_member: true,
      read_only: false,
      extra: "kept",
    });

    expect(parsed.success).toBe(true);
    expect(parsed.data.board._id).toBe("b1");
    expect(parsed.data.extra).toBe("kept");
  });

  it("rejects board detail without board._id", () => {
    expect(
      boardDetailContract.safeParse({ board: { title: "Missing id" } }).success,
    ).toBe(false);
  });

  it("accepts auth user payloads", () => {
    const parsed = authUserDataContract.safeParse({
      user: {
        _id: "u1",
        email: "a@b.c",
        full_name: "Ann",
        avatar: { url: "https://example.com/a.png", public_id: "a" },
      },
    });
    expect(parsed.success).toBe(true);
  });

  it("accepts auth users with a string avatar URL", () => {
    expect(
      authUserDataContract.safeParse({
        user: { _id: "u1", avatar: "https://example.com/a.png" },
      }).success,
    ).toBe(true);
  });

  it("accepts card mutation payloads", () => {
    const parsed = cardMutationDataContract.safeParse({
      card: { _id: "c1", title: "Task", pos: 1 },
    });
    expect(parsed.success).toBe(true);
  });

  it("requires upload signature fields", () => {
    expect(
      uploadSignatureContract.safeParse({
        cloudName: "demo",
        resource_type: "image",
        signature: "sig",
        timestamp: 123,
        apiKey: "key",
      }).success,
    ).toBe(true);

    expect(
      uploadSignatureContract.safeParse({
        cloudName: "demo",
        signature: "sig",
      }).success,
    ).toBe(false);
  });

  it("accepts notifications page payloads", () => {
    const parsed = notificationsPageContract.safeParse({
      notifications: [{ _id: "n1", message: "hi" }],
      pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
    });
    expect(parsed.success).toBe(true);
  });
});
