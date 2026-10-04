"use client"

import { useId } from "react"

import { createAnimatedIcon } from "../lib/create-icon"
import { flash, pivot, slot } from "../lib/motion"
import { useShapedDrawing } from "../lib/shape"

declare module "../lib/types" {
  interface IconVariants {
    monitor: "power" | "glow" | "scroll"
  }
}

/** The screen's inside: the frame is 2..22 × 3..16, so its stroke's inner edge sits at 3..21 × 4..15. */
const SCREEN = { x: 3, y: 4, width: 18, height: 11 }

/** Two lines of text, 2 clear of the frame and of each other. */
const LINES = [
  { part: "line-1", d: "M6 7h12" },
  { part: "line-2", d: "M6 11h7" },
] as const

/**
 * The content and the glow sit inside a clip of the screen's inner edge, so content scrolling off
 * the screen slips under the frame instead of crossing its stroke.
 */
function Drawing() {
  const clip = `monitor-${useId().replace(/[^\w-]/g, "")}`
  // drawn in its own component (for the clip id), so it shapes its corners from context
  return useShapedDrawing(
    <>
      <clipPath id={clip}>
        <rect {...SCREEN} />
      </clipPath>
      <path d="M2 3h20v13H2Z" />
      {/* a two-legged neck standing on a flat foot */}
      <path d="M10 16v5M14 16v5M7 21h10" />
      <g clipPath={`url(#${clip})`}>
        <rect data-part="glow" {...SCREEN} fill={slot.accent} fillOpacity={0.2} stroke="none" style={flash()} />
        <g data-part="content" stroke={slot.accent} style={pivot("50% 50%")}>
          {LINES.map(({ part, d }) => (
            <path key={part} data-part={part} d={d} />
          ))}
        </g>
      </g>
    </>,
  )
}

/** 2 colors: screen + stand (primary), screen content and glow (accent). */
export const Monitor = createAnimatedIcon({
  name: "monitor",
  category: "devices",
  keywords: ["screen", "display", "desktop", "computer", "pc", "imac"],
  slots: { primary: "screen + stand", accent: "screen content + glow" },
  defaultVariant: "power",
  variants: {
    // the screen flashes on and the lines type themselves in, top line first
    // (each hidden until it starts drawing, so its cap never shows as a dot)
    power: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=glow]", { opacity: [0, 1, 0] }, { duration: seconds * 0.6, ease: "easeOut" }),
          ...LINES.map(({ part }, i) => {
            const start = 0.2 + i * 0.3
            return Promise.all([
              animate(
                `[data-part=${part}]`,
                // spacing 1 keeps the dash pattern's next dash past the end, so no cap dot shows there
                { pathLength: [0, 0, 1, 1], pathSpacing: [1, 1, 1, 1] },
                { duration: seconds, times: [0, start, start + 0.35, 1], ease: "easeOut" },
              ),
              animate(
                `[data-part=${part}]`,
                { opacity: [0, 0, 1, 1] },
                { duration: seconds, times: [0, start, start + 0.02, 1] },
              ),
            ])
          }),
        ]),
    },
    // the screen lights up for a moment and the content swells with it
    glow: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=glow]", { opacity: [0, 1, 0] }, { duration: seconds, ease: "easeInOut" }),
          animate("[data-part=content]", { scale: [1, 1.06, 1] }, { duration: seconds, ease: "easeInOut" }),
        ]),
    },
    // the page scrolls up under the top of the frame and the next one comes up from the bottom
    // (a long move, but clipped by the screen, inside the frame)
    scroll: {
      clip: false,
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=content]",
            { y: [0, -8, 9, 0] },
            { duration: seconds, times: [0, 0.45, 0.55, 1], ease: "easeInOut" },
          ),
          // invisible only for the jump back to the bottom, while it is off the screen anyway
          animate(
            "[data-part=content]",
            { opacity: [1, 1, 0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.44, 0.45, 0.55, 0.56, 1] },
          ),
        ]),
    },
  },
  render: () => <Drawing />,
})
