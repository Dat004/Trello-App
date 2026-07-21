import process from "node:process";

export const DEMO = {
  password: process.env.E2E_DEMO_PASSWORD || "Demo123!",
  owner: {
    email: "owner@demo.local",
    name: "Demo Owner",
  },
  viewer: {
    email: "viewer@demo.local",
    name: "Demo Viewer",
  },
};

/**
 * Fill the login form and wait until the app lands on the home dashboard.
 */
export async function loginAs(page, { email, password = DEMO.password }) {
  await page.goto("/login", { waitUntil: "domcontentloaded" });
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Mật khẩu").fill(password);
  await page.getByRole("button", { name: "Đăng nhập" }).click();
  await page.waitForURL((url) => url.pathname === "/", { timeout: 15000 });
}

export async function logoutFromHeader(page) {
  await page.getByRole("button", { name: "Mở menu tài khoản" }).click();
  await page.getByRole("menuitem", { name: "Đăng xuất" }).click();
  await page.waitForURL(/\/login$/, { timeout: 10000 });
}
