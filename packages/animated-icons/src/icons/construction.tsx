"use client"

import { useId } from "react"

import { createAnimatedIcon } from "../lib/create-icon"
import { useShapedDrawing } from "../lib/shape"
import { ease, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    construction: "blink" | "topple" | "slide"
  }
}

/** The barrier's board, 2..22 × 6..14. */
const BOARD = "M2 6h20v8H2Z"

/**
 * Hazard stripes, 6 apart along the board, one spare off its left end: marching them right by one
 * stripe brings the spare in exactly where the first one sat.
 */
const STRIPES = [-4, 2, 8, 14].map((x) => `M${x} 6l8 8`).join("")

/**
 * The stripes are clipped to the board, so they can march along it. Drawn in its own component
 * (for the clip id), so it shapes its corners from context.
 */
function Drawing() {
  const clip = `construction-${useId().replace(/[^\w-]/g, "")}`
  return useShapedDrawing(
    <g data-part="barrier" style={pivot("50% 100%")}>
      <clipPath id={clip}>
        <path d={BOARD} />
      </clipPath>
      <g clipPath={`url(#${clip})`}>
        <path data-part="stripes" d={STRIPES} stroke={slot.accent} />
      </g>
      <path d={BOARD} />
      {/* two legs on flat feet */}
      <path d="M6 14v7M18 14v7M4 21h4M16 21h4" />
      {/* warning lamps sitting on the board's top edge */}
      <g fill={slot.accent} stroke="none">
        <rect data-part="lamp-l" x="4.5" y="2" width="3" height="3" style={pivot("50% 100%")} />
        <rect data-part="lamp-r" x="16.5" y="2" width="3" height="3" style={pivot("50% 100%")} />
      </g>
    </g>,
  )
}

/** One lamp's flash: popping up bright, dimming, popping again. */
const FLASH = { scale: [1, 1.5, 1, 1.5, 1], opacity: [1, 0.35, 1, 0.35, 1] }

/** 2 colors: board and legs (primary), stripes and lamps (accent). */
export const Construction = createAnimatedIcon({
  name: "construction",
  category: "tools",
  keywords: ["barrier", "roadwork", "under construction", "work in progress", "roadblock", "maintenance", "wip", "detour"],
  slots: { primary: "board + legs", accent: "stripes + lamps" },
  defaultVariant: "blink",
  variants: {
    // the warning lamps flash in turn while the hazard stripes march along the board
    blink: {
      clip: false,
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=stripes]",
            { x: [0, 6, 0] },
            { duration: seconds, times: [0, 0.999, 1], ease: ["linear", snap] },
          ),
          animate("[data-part=lamp-l]", FLASH, { duration: seconds * 0.8, ease: "easeInOut" }),
          animate("[data-part=lamp-r]", FLASH, { duration: seconds * 0.8, delay: seconds * 0.2, ease: "easeInOut" }),
        ]),
    },
    // knocked over backward: it tips away from you, foreshortening flat, and rocks back upright
    topple: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=barrier]",
            { scaleY: [1, 0.5, 1.08, 0.96, 1], scaleX: [1, 0.94, 1.02, 1, 1], skewX: [0, -8, 4, -1, 0] },
            {
              duration: seconds,
              times: [0, 0.4, 0.65, 0.82, 1],
              ease: [ease.in, "easeOut", "easeInOut", "easeInOut"],
            },
          ),
          animate(
            "[data-part=lamp-l], [data-part=lamp-r]",
            { scale: [1, 1, 1.6, 1] },
            { duration: seconds * 0.5, times: [0, 0.6, 0.8, 1], delay: seconds * 0.3, ease: "easeOut" },
          ),
        ]),
    },
    // dragged off to the right, leaning into the pull, and set down again from the left, rocking
    // as it stops
    slide: {
      clip: true,
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=barrier]",
          { x: [0, 26, -26, 0, 0, 0], skewX: [0, 15, 15, -10, 4, 0] },
          {
            duration: seconds,
            times: [0, 0.4, 0.41, 0.75, 0.88, 1],
            ease: [ease.in, snap, ease.out, "easeInOut", "easeInOut"],
          },
        ),
    },
  },
  render: () => <Drawing />,
})
