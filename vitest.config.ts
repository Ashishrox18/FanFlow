/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "tests/", "next.config.ts", "postcss.config.mjs", "tailwind.config.ts"],
      thresholds: {
        lines: 50,
        functions: 50,
        branches: 50,
        statements: 50,
      }
    },
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
