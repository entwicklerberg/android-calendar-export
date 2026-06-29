import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    environmentMatchGlobs: [["test/**/*.dom.test.ts", "jsdom"]],
  },
});
