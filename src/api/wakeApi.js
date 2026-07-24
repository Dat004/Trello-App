import ENV_CONFIG from "@/config/env";

const HEALTH_PATH = "/api/health";
const MAX_ATTEMPTS = 4;
const BASE_DELAY_MS = 1500;

function healthUrl() {
  const base = (ENV_CONFIG.API_URL || "").replace(/\/$/, "");
  if (!base) return HEALTH_PATH;
  if (base.endsWith("/api")) return `${base}/health`;
  return `${base}${HEALTH_PATH}`;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Hit BE /api/health to wake a sleeping Render free instance.
 * Safe to call multiple times; concurrent callers share one in-flight promise.
 */
let wakePromise = null;

export async function wakeBackend({
  attempts = MAX_ATTEMPTS,
  timeoutMs = 25000,
} = {}) {
  if (wakePromise) return wakePromise;

  wakePromise = (async () => {
    const url = healthUrl();
    let lastError;

    for (let attempt = 1; attempt <= attempts; attempt += 1) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const res = await fetch(url, {
          method: "GET",
          signal: controller.signal,
          credentials: "omit",
          cache: "no-store",
        });
        if (res.ok) return true;
        lastError = new Error(`Health ${res.status}`);
      } catch (error) {
        lastError = error;
      } finally {
        clearTimeout(timer);
      }

      if (attempt < attempts) {
        await sleep(BASE_DELAY_MS * attempt);
      }
    }

    console.warn("[wakeBackend] API still cold after retries", lastError);
    return false;
  })().finally(() => {
    // Allow a later wake if the first batch failed or hours later we sleep again
    setTimeout(() => {
      wakePromise = null;
    }, 30_000);
  });

  return wakePromise;
}

export function isLikelyColdStartError(error) {
  if (!error) return false;
  const status = error.response?.status;
  if ([502, 503, 504].includes(status)) return true;
  const code = error.code;
  return (
    code === "ECONNABORTED" ||
    code === "ERR_NETWORK" ||
    code === "ETIMEDOUT" ||
    error.message?.includes("timeout")
  );
}
