import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const rejectSession = (page) =>
  page.route("**/api/users/me", (route) =>
    route.fulfill({
      status: 401,
      contentType: "application/json",
      body: JSON.stringify({ success: false, message: "Unauthenticated" }),
    }),
  );

test.describe("guest accessibility", () => {
  test.beforeEach(async ({ page }) => {
    await rejectSession(page);
  });

  test("login page has no serious axe violations", async ({ page }) => {
    await page.goto("/login", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Đăng nhập để tiếp tục" })).toBeVisible();

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });

  test("register page has no serious axe violations", async ({ page }) => {
    await page.goto("/register", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Đăng ký tài khoản mới" })).toBeVisible();

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });
});
