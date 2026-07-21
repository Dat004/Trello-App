import { defineConfig, devices } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const beRoot = path.resolve(__dirname, "../BE");
const hasBackend = fs.existsSync(path.join(beRoot, "package.json"));
const apiUrl = process.env.E2E_API_URL || "http://127.0.0.1:5000";
const feUrl = "http://127.0.0.1:4173";

const webServers = [];

// FE CI only checks out this repo — starting BE with a missing cwd yields\
if (hasBackend) {
  webServers.push({
    command: "npm start",
    cwd: beRoot,
    url: `${apiUrl}/api/health`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      ...process.env,
      CLIENT_URL: feUrl,
      CLIENT_URLS: [
        feUrl,
        "http://localhost:4173",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
      ].join(","),
    },
  });
}

webServers.push({
  command: "npm run dev -- --host 127.0.0.1 --port 4173",
  url: feUrl,
  reuseExistingServer: !process.env.CI,
  timeout: 120_000,
  env: {
    ...process.env,
    VITE_API_URI: apiUrl,
    VITE_SOCKET_URI: apiUrl,
  },
});

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "list",
  globalSetup: "./e2e/global-setup.js",
  // Auth/role specs hit a real API; skip them in FE-only CI without ../BE.
  testIgnore: hasBackend
    ? undefined
    : [/(auth|role-matrix)\.spec\.js$/],
  timeout: 60_000,
  use: {
    baseURL: feUrl,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: webServers,
});
