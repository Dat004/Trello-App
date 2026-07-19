import { expect, test } from "@playwright/test";

const rejectSession = (page) =>
  page.route("**/api/users/me", (route) =>
    route.fulfill({
      status: 401,
      contentType: "application/json",
      body: JSON.stringify({ success: false, message: "Unauthenticated" }),
    }),
  );

test.describe("guest routes", () => {
  test.beforeEach(async ({ page }) => {
    await rejectSession(page);
  });

  test("renders login without backend services", async ({ page }) => {
    await page.goto("/login", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { name: "Đăng nhập để tiếp tục" })).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Mật khẩu")).toBeVisible();
    await expect(page.getByRole("link", { name: "Tạo tài khoản" })).toHaveAttribute(
      "href",
      "/register",
    );
  });

  test("renders registration and links back to login", async ({ page }) => {
    await page.goto("/register", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { name: "Đăng ký tài khoản mới" })).toBeVisible();
    await expect(page.getByLabel("Tên đầy đủ")).toBeVisible();
    await expect(page.getByRole("link", { name: "Đăng nhập ngay" })).toHaveAttribute(
      "href",
      "/login",
    );
  });

  test("renders the 404 fallback for unknown routes", async ({ page }) => {
    await page.goto("/route-that-does-not-exist", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { name: "Không tìm thấy trang" })).toBeVisible();
    await expect(page.getByText("404", { exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Về trang chủ" })).toHaveAttribute("href", "/");
  });
});

test("keeps a protected route behind auth initialization, then redirects", async ({ page }) => {
  let resolveSession;
  const sessionRequested = new Promise((resolve) => {
    resolveSession = resolve;
  });

  await page.route("**/api/users/me", async (route) => {
    resolveSession();
    await new Promise((resolve) => setTimeout(resolve, 250));
    await route.fulfill({
      status: 401,
      contentType: "application/json",
      body: JSON.stringify({ success: false, message: "Unauthenticated" }),
    });
  });

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await sessionRequested;
  await expect(page).toHaveURL("/");
  await expect(page.getByRole("heading", { name: "Đăng nhập để tiếp tục" })).toHaveCount(0);
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { name: "Đăng nhập để tiếp tục" })).toBeVisible();
});
