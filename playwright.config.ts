import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  webServer: {
    command: "npm run dev -- --host 127.0.0.1 --port 4174",
    port: 4174,
    reuseExistingServer: false,
  },
  use: {
    baseURL: "http://127.0.0.1:4174",
  },
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
      animations: "disabled",
    },
  },
  snapshotPathTemplate: "screenshots/baseline/{testFilePath}/{arg}{ext}",
});
