import { defineConfig } from "tsup"

// File by file, not bundled: every module keeps its own "use client" directive, and consumers'
// bundlers tree-shake per icon. Declarations come from tsc (tsconfig.build.json).
export default defineConfig({
  entry: ["src/**/*.{ts,tsx}"],
  format: ["esm"],
  bundle: false,
  dts: false,
  sourcemap: true,
  clean: true,
  outDir: "dist",
  target: "es2022",
})
