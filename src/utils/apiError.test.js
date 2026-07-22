import { describe, expect, it } from "vitest";

import { getApiErrorMessage, parseApiData, unwrapApiData } from "./apiError";

describe("getApiErrorMessage", () => {
  it.each([
    ["plain strings", "Network unavailable", "Network unavailable"],
    ["Axios responses", { response: { data: { message: "Session expired" } } }, "Session expired"],
    ["API envelopes", { data: { message: "Board not found" } }, "Board not found"],
    ["native errors", new Error("Unexpected failure"), "Unexpected failure"],
    ["empty values", null, "Custom fallback"],
  ])("handles %s", (_label, error, expected) => {
    expect(getApiErrorMessage(error, "Custom fallback")).toBe(expected);
  });

  it("prioritizes the server response over less specific messages", () => {
    expect(
      getApiErrorMessage({
        message: "Axios error",
        data: { message: "Envelope error" },
        response: { data: { message: "Server validation error" } },
      }),
    ).toBe("Server validation error");
  });
});

describe("unwrapApiData", () => {
  it("returns typed envelope data on success", () => {
    const data = { board: { _id: "board-1" } };

    expect(unwrapApiData({ data: { success: true, data } })).toBe(data);
  });

  it("throws the API message for unsuccessful responses", () => {
    expect(() =>
      unwrapApiData({ data: { success: false, message: "Permission denied" } }),
    ).toThrow("Permission denied");
  });

  it("uses the supplied fallback for malformed responses", () => {
    expect(() => unwrapApiData(undefined, "Malformed response")).toThrow(
      "Malformed response",
    );
  });
});

describe("parseApiData", () => {
  const schema = {
    safeParse: (value) =>
      value?.ok
        ? { success: true, data: value }
        : { success: false, error: new Error("bad") },
  };

  it("returns schema data for a successful envelope", () => {
    expect(
      parseApiData({ data: { success: true, data: { ok: true, n: 1 } } }, schema),
    ).toEqual({ ok: true, n: 1 });
  });

  it("throws when the schema rejects the payload", () => {
    expect(() =>
      parseApiData(
        { data: { success: true, data: { ok: false } } },
        schema,
        "Invalid payload",
      ),
    ).toThrow("Invalid payload");
  });
});
