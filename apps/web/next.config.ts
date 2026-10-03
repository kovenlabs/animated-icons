import { createMDX } from "fumadocs-mdx/next"
import type { NextConfig } from "next"

const withMDX = createMDX()

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // the library ships TypeScript source inside the workspace
  transpilePackages: ["@kovenlabs/animated-icons"],
  // OG images read the vendored fonts at runtime if one is ever rendered on demand
  outputFileTracingIncludes: { "/**": ["./assets/fonts/**"] },
}

export default withMDX(nextConfig)
