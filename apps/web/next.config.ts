import { createMDX } from "fumadocs-mdx/next"
import type { NextConfig } from "next"

const withMDX = createMDX()

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // the library ships TypeScript source inside the workspace
  transpilePackages: ["@kovenlabs/animated-icons"],
}

export default withMDX(nextConfig)
