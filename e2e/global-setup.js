import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const beRoot = path.resolve(__dirname, "../../BE");

/**
 * Ensures demo accounts exist before authenticated Playwright specs run.
 */
export default async function globalSetup() {
  if (process.env.E2E_SKIP_SEED === "1") {
    console.log("[e2e] Skipping demo seed (E2E_SKIP_SEED=1)");
    return;
  }

  if (!fs.existsSync(path.join(beRoot, "package.json"))) {
    console.log("[e2e] Skipping demo seed (backend package not found at ../BE)");
    return;
  }

  console.log("[e2e] Seeding demo accounts...");
  execSync("npm run seed:demo", {
    cwd: beRoot,
    stdio: "inherit",
    env: process.env,
  });
}
