import { defineConfig } from "@playwright/test"

const PORT = 3400

export default defineConfig({
  testDir: "e2e",
  timeout: 60_000,
  use: {
    baseURL: `http://localhost:${PORT}`,
    viewport: { width: 1152, height: 1400 },
    // locally, the installed Chrome; in CI, Playwright's own Chromium
    ...(process.env.CI ? {} : { channel: "chrome" }),
  },
  webServer: {
    command: `pnpm build && pnpm start -p ${PORT}`,
    url: `http://localhost:${PORT}/e2e/variants`,
    env: { NEXT_PUBLIC_E2E: "1" },
    reuseExistingServer: false,
    timeout: 240_000,
  },
})
