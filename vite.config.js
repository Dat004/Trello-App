import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".");

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "./src"),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: env.VITE_API_URI,
          changeOrigin: true,
        },
      },
    },
    test: {
      environment: "jsdom",
      setupFiles: "./src/test/setup.js",
      exclude: ["e2e/**", "node_modules/**"],
      css: true,
      coverage: {
        provider: "v8",
        reporter: ["text", "html"],
        reportsDirectory: "./coverage",
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes("node_modules")) return undefined;
            if (id.includes("react-dom") || id.includes("react-router") || id.includes("/react/")) {
              return "react-vendor";
            }
            if (id.includes("@tanstack") || id.includes("zustand")) return "state-vendor";
            if (id.includes("@dnd-kit")) return "dnd-vendor";
            if (id.includes("@radix-ui")) return "radix-vendor";
            if (id.includes("framer-motion")) return "motion-vendor";
            if (id.includes("date-fns") || id.includes("dayjs")) return "date-vendor";
            if (id.includes("react-hook-form") || id.includes("@hookform") || id.includes("/zod/")) {
              return "forms-vendor";
            }
            return undefined;
          },
        },
      },
    },
  };
});
