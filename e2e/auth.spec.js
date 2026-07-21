import { expect, test } from "@playwright/test";

import { DEMO, loginAs, logoutFromHeader } from "./helpers/auth";

test.describe("authenticated auth flows", () => {
  test("logs in with a seeded demo account and shows the home greeting", async ({
    page,
  }) => {
    await loginAs(page, DEMO.owner);

    await expect(
      page.getByRole("heading", { name: new RegExp(DEMO.owner.name) }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Mở menu tài khoản" })).toBeVisible();
  });

  test("rejects invalid credentials and stays on login", async ({ page }) => {
    await page.goto("/login", { waitUntil: "domcontentloaded" });
    await page.getByLabel("Email").fill(DEMO.owner.email);
    await page.getByLabel("Mật khẩu").fill("WrongPass1!");
    await page.getByRole("button", { name: "Đăng nhập" }).click();

    await expect(page.getByText(/Email hoặc mật khẩu không đúng|Đăng nhập thất bại/i)).toBeVisible({
      timeout: 10000,
    });
    await expect(page).toHaveURL(/\/login$/);
    await expect(
      page.getByRole("heading", { name: "Đăng nhập để tiếp tục" }),
    ).toBeVisible();
  });

  test("logs out and blocks the home route again", async ({ page }) => {
    await loginAs(page, DEMO.owner);
    await logoutFromHeader(page);

    await expect(
      page.getByRole("heading", { name: "Đăng nhập để tiếp tục" }),
    ).toBeVisible();

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/login$/);
  });

  test("keeps the session across a full page reload", async ({ page }) => {
    await loginAs(page, DEMO.viewer);
    await page.reload({ waitUntil: "domcontentloaded" });

    await expect(page).toHaveURL("/");
    await expect(
      page.getByRole("heading", { name: new RegExp(DEMO.viewer.name) }),
    ).toBeVisible({ timeout: 15000 });
  });

  test("registers a disposable account and lands on home", async ({ page }) => {
    const stamp = Date.now();
    const email = `e2e.${stamp}@demo.local`;
    const fullName = `E2E User ${stamp}`;

    await page.goto("/register", { waitUntil: "domcontentloaded" });
    await page.getByLabel("Tên đầy đủ").fill(fullName);
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Mật khẩu", { exact: true }).fill(DEMO.password);
    await page.getByLabel("Xác nhận mật khẩu").fill(DEMO.password);
    await page.getByRole("button", { name: "Đăng ký" }).click();

    await page.waitForURL((url) => url.pathname === "/", { timeout: 15000 });
    await expect(
      page.getByRole("heading", { name: new RegExp(fullName) }),
    ).toBeVisible();
  });

  test("submits forgot password without revealing account existence", async ({
    page,
  }) => {
    await page.goto("/forgot-password", { waitUntil: "domcontentloaded" });
    await page.getByLabel("Email").fill("unknown-user@demo.local");
    await page.getByRole("button", { name: "Gửi liên kết đặt lại" }).click();

    await expect(
      page.getByText(
        "Nếu email tồn tại, hướng dẫn đặt lại mật khẩu đã được gửi.",
      ),
    ).toBeVisible();
  });

  test("shows a safe error for an invalid reset token", async ({ page }) => {
    await page.goto(`/reset-password/${"a".repeat(64)}`, {
      waitUntil: "domcontentloaded",
    });

    await expect(
      page.getByText("Liên kết không hợp lệ", { exact: true }),
    ).toBeVisible({ timeout: 10_000 });
    await expect(page.getByLabel("Mật khẩu mới", { exact: true })).toHaveCount(0);
    await expect(
      page.getByRole("link", { name: "Yêu cầu liên kết mới" }),
    ).toBeVisible();
    await expect(page).toHaveURL(/\/reset-password\//);
  });

  test("changes password and invalidates the current session", async ({ page }) => {
    const stamp = Date.now();
    const email = `change-password.${stamp}@demo.local`;
    const oldPassword = "OldDemo123!";
    const newPassword = "NewDemo456!";

    await page.goto("/register", { waitUntil: "domcontentloaded" });
    await page.getByLabel("Tên đầy đủ").fill(`Password User ${stamp}`);
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Mật khẩu", { exact: true }).fill(oldPassword);
    await page.getByLabel("Xác nhận mật khẩu").fill(oldPassword);
    await page.getByRole("button", { name: "Đăng ký" }).click();
    await page.waitForURL((url) => url.pathname === "/", { timeout: 15000 });

    await page.goto("/settings/account", { waitUntil: "domcontentloaded" });
    await page.getByLabel("Mật khẩu hiện tại").fill(oldPassword);
    await page.getByLabel("Mật khẩu mới", { exact: true }).fill(newPassword);
    await page.getByLabel("Xác nhận mật khẩu mới").fill(newPassword);
    await page.getByRole("button", { name: "Cập nhật mật khẩu" }).click();

    await page.waitForURL(/\/login$/, { timeout: 15000 });
    await loginAs(page, { email, password: newPassword });
    await expect(page).toHaveURL("/");
  });
});
