import { readFile } from "node:fs/promises"
import { join } from "node:path"

import { ImageResponse } from "next/og"

import { LOGO } from "@/components/brand/logo-geometry"
import { SITE_URL } from "@/lib/site"

/** The size social networks expect for a large preview card. */
export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = "image/png"

// vendored Geist and a static Doto instance (OFL, see assets/fonts/LICENSE-*.txt): no network at build time
const font = (file: string) => readFile(join(process.cwd(), "assets/fonts", file))
const fonts = Promise.all([
  font("Geist-Regular.ttf"),
  font("Geist-SemiBold.ttf"),
  font("GeistMono-Medium.ttf"),
  font("Doto-Black-Round.ttf"),
])

// the landing's drafting sheet, light theme: white paper, ink, construction lines in the brand blue
const PAPER = "#ffffff"
const INK = LOGO.colors.ink
const MUTED = "#737373"
const BORDER = "#e5e5e5"
const KEYLINE = LOGO.colors.accent
const GRID_LINE = "rgba(37, 99, 235, 0.11)"
const HOST = SITE_URL.replace(/^https?:\/\//, "")

const BOARD = 360
const RULER = 22
// the drawing's own coordinates: the frame, the 2-unit padding every icon keeps, and the centre
const MARKS = [0, 2, 12, 22, 24]
const UNITS = Array.from({ length: 25 }, (_, i) => i)

function Mark({ size, stroke }: { size: number; stroke: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d={LOGO.canvas} stroke={stroke} />
      {LOGO.trail.map((d) => (
        <path key={d} d={d} stroke={LOGO.colors.trail} />
      ))}
      <path d={LOGO.badge} fill={LOGO.colors.accent} />
    </svg>
  )
}

/** The landing's specimen: the mark on its 24 × 24 construction grid, with rulers. */
function DraftingBoard() {
  const scale = BOARD / 24
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", height: RULER, marginLeft: RULER, position: "relative", width: BOARD }}>
        {MARKS.map((mark) => (
          <div
            key={mark}
            style={{ position: "absolute", left: mark * scale - 12, width: 24, display: "flex", justifyContent: "center" }}
          >
            {mark}
          </div>
        ))}
      </div>
      <div style={{ display: "flex" }}>
        <div style={{ display: "flex", width: RULER, height: BOARD, position: "relative" }}>
          {MARKS.map((mark) => (
            <div
              key={mark}
              style={{ position: "absolute", top: mark * scale - 9, right: 6, height: 18, display: "flex", alignItems: "center" }}
            >
              {mark}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", position: "relative", width: BOARD, height: BOARD, background: PAPER }}>
          <svg width={BOARD} height={BOARD} viewBox={`0 0 ${BOARD} ${BOARD}`} style={{ position: "absolute", top: 0, left: 0 }}>
            {UNITS.map((u) => (
              <path key={u} d={`M${u * scale} 0V${BOARD}M0 ${u * scale}H${BOARD}`} stroke={GRID_LINE} strokeWidth={1} />
            ))}
            <rect
              x={2 * scale}
              y={2 * scale}
              width={20 * scale}
              height={20 * scale}
              fill="none"
              stroke={KEYLINE}
              strokeWidth={1}
              strokeDasharray="4 4"
            />
            <path d={`M${BOARD / 2} 0V${BOARD}M0 ${BOARD / 2}H${BOARD}`} stroke={KEYLINE} strokeOpacity={0.4} strokeWidth={1} />
            <rect x={0.5} y={0.5} width={BOARD - 1} height={BOARD - 1} fill="none" stroke={KEYLINE} strokeOpacity={0.4} />
          </svg>
          <Mark size={BOARD} stroke={INK} />
        </div>
      </div>
    </div>
  )
}

/** The site's share card: the landing's drafting sheet with a dot-matrix title, the page's description and how to install. */
export async function ogImage({ label, title, description }: { label: string; title: string; description: string }) {
  const [regular, semibold, mono, doto] = await fonts
  // Doto's cells are ~0.58em wide: a single long word ("Configuration") can't wrap, so it caps the size
  const longestWord = Math.max(...title.split(/\s+/).map((word) => word.length))
  const titleSize = Math.min(title.length > 28 ? 60 : title.length > 16 ? 76 : 96, Math.floor(600 / (longestWord * 0.58)))

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 48,
          padding: "56px 64px",
          background: PAPER,
          color: INK,
          fontFamily: "Geist",
          // the sheet the specimen sits on: the same faint blue grid
          backgroundImage: `linear-gradient(to right, ${GRID_LINE} 1px, transparent 1px), linear-gradient(to bottom, ${GRID_LINE} 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, height: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Mark size={44} stroke={INK} />
            <div style={{ display: "flex", flexShrink: 0, fontSize: 30, fontWeight: 600, letterSpacing: -0.5 }}>
              Animated Icons
            </div>
            <div
              style={{
                display: "flex",
                marginLeft: 8,
                flexShrink: 0,
                whiteSpace: "nowrap",
                fontFamily: "Geist Mono",
                fontSize: 18,
                color: MUTED,
                border: `1px solid ${BORDER}`,
                background: PAPER,
                padding: "6px 12px",
              }}
            >
              {label}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div
              style={{
                display: "flex",
                fontFamily: "Doto",
                fontWeight: 900,
                fontSize: titleSize,
                lineHeight: 0.95,
                letterSpacing: -0.04 * titleSize,
              }}
            >
              {title}
            </div>
            <div style={{ display: "flex", fontSize: 26, lineHeight: 1.4, color: MUTED }}>{description}</div>
          </div>

          <div style={{ display: "flex", fontFamily: "Geist Mono" }}>
            <div
              style={{
                display: "flex",
                flexShrink: 0,
                whiteSpace: "nowrap",
                fontSize: 20,
                border: `1px solid ${BORDER}`,
                background: PAPER,
                padding: "10px 16px",
              }}
            >
              npx shadcn add @kovenlabs/all
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 16, fontSize: 13, color: MUTED }}>
          <DraftingBoard />
          <div style={{ display: "flex", fontFamily: "Geist Mono", fontSize: 18 }}>{HOST}</div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Geist", data: regular, weight: 400, style: "normal" },
        { name: "Geist", data: semibold, weight: 600, style: "normal" },
        { name: "Geist Mono", data: mono, weight: 500, style: "normal" },
        { name: "Doto", data: doto, weight: 900, style: "normal" },
      ],
    },
  )
}
