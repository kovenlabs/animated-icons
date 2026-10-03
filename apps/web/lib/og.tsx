import { readFile } from "node:fs/promises"
import { join } from "node:path"

import { ImageResponse } from "next/og"

import { LOGO } from "@/components/brand/logo-geometry"
import { SITE_URL } from "@/lib/site"

/** The size social networks expect for a large preview card. */
export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = "image/png"

// vendored Geist (OFL, see assets/fonts/LICENSE-Geist.txt): no network at build time
const font = (file: string) => readFile(join(process.cwd(), "assets/fonts", file))
const fonts = Promise.all([font("Geist-Regular.ttf"), font("Geist-SemiBold.ttf"), font("GeistMono-Medium.ttf")])

const INK = LOGO.colors.ink
const PAPER = LOGO.colors.paper
const MUTED = "#a3a3a3"
const LINE = "#262626"
const HOST = SITE_URL.replace(/^https?:\/\//, "")

function Mark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d={LOGO.canvas} stroke={PAPER} />
      {LOGO.trail.map((d) => (
        <path key={d} d={d} stroke={LOGO.colors.trail} />
      ))}
      <path d={LOGO.badge} fill={LOGO.colors.accent} />
    </svg>
  )
}

/** The site's share card: logo, a label, the page's title and description, and how to install. */
export async function ogImage({ label, title, description }: { label: string; title: string; description: string }) {
  const [regular, semibold, mono] = await fonts
  const titleSize = title.length > 36 ? 64 : 76

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: INK,
          color: PAPER,
          fontFamily: "Geist",
          // the 24-unit grid the icons are drawn on
          backgroundImage: `linear-gradient(to right, ${LINE} 1px, transparent 1px), linear-gradient(to bottom, ${LINE} 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ display: "flex", padding: 16, border: `1px solid ${LINE}`, background: INK }}>
              <Mark size={56} />
            </div>
            <div style={{ display: "flex", fontSize: 34, fontWeight: 600, letterSpacing: -0.5 }}>Animated Icons</div>
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "Geist Mono",
              fontSize: 22,
              color: MUTED,
              border: `1px solid ${LINE}`,
              background: INK,
              padding: "8px 16px",
            }}
          >
            {label}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 980 }}>
          <div style={{ display: "flex", fontSize: titleSize, fontWeight: 600, lineHeight: 1.05, letterSpacing: -2 }}>
            {title}
          </div>
          <div style={{ display: "flex", fontSize: 30, lineHeight: 1.35, color: MUTED }}>{description}</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: "Geist Mono" }}>
          <div style={{ display: "flex", fontSize: 24, border: `1px solid ${LINE}`, background: INK, padding: "12px 20px" }}>
            npx shadcn add @kovenlabs/all
          </div>
          <div style={{ display: "flex", fontSize: 22, color: MUTED }}>{HOST}</div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Geist", data: regular, weight: 400, style: "normal" },
        { name: "Geist", data: semibold, weight: 600, style: "normal" },
        { name: "Geist Mono", data: mono, weight: 500, style: "normal" },
      ],
    },
  )
}
