"use client"

import { useId } from "react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot, snap } from "../lib/motion"
import { useShapedDrawing } from "../lib/shape"

declare module "../lib/types" {
  interface IconVariants {
    earth: "spin" | "orbit" | "wobble"
  }
}

/**
 * Two solid continents, faceted, laid on a 20px-wide strip of map (x 2 to 22) that wraps round: the
 * strip is drawn twice, the copy one strip to the west, so when the strip rolls a whole width east the
 * copy lands exactly where it started. The west continent runs north to south down the left, the east
 * one is broad in the north and tapers south.
 */
const LANDS = ["M5 4h6v3l-2 2 1 2v3l-2 4H7v-4l-2-3-1-3z", "M13 6l4-1 3 2-2 3h-1v3l-2 4h-1l-1-5-1-2 1-2z"]
const WRAP = 20

/** One full turn of the map strip: it rolls a whole strip east, and the copy behind it takes its place. */
const TURN = { x: [0, WRAP, 0] }

/** 2 colors: globe (primary), land (accent). */
function Drawing() {
  const globe = `earth-${useId().replace(/[^\w-]/g, "")}`
  // drawn in its own component (for the clip id), so it shapes its corners from context
  return useShapedDrawing(
    <g data-part="earth" style={pivot("50% 50%")}>
      {/* the land is seen only through a window 2px inside the rim, so a strip of sea always rings it */}
      <clipPath id={globe}>
        <circle cx="12" cy="12" r="7" />
      </clipPath>
      <g clipPath={`url(#${globe})`}>
        <g data-part="land" fill={slot.accent} stroke="none">
          {[0, -WRAP].map((dx) => (
            <g key={dx} transform={dx ? `translate(${dx} 0)` : undefined}>
              {LANDS.map((d) => (
                <path key={d} d={d} />
              ))}
            </g>
          ))}
        </g>
      </g>
      {/* the earth is round, so it is a true circle */}
      <circle cx="12" cy="12" r="10" />
    </g>,
  )
}

export const Earth = createAnimatedIcon({
  name: "earth",
  category: "navigation",
  keywords: ["world", "planet", "globe", "earth", "international", "global", "geography", "map"],
  slots: { primary: "globe", accent: "land" },
  defaultVariant: "spin",
  variants: {
    // the earth turns a full day: the continents roll east over the horizon and come back round from
    // the west, slow to start, quick through the middle and easing in to rest
    spin: {
      clip: false,
      duration: 1400,
      run: ({ animate, seconds }) =>
        animate("[data-part=land]", TURN, { duration: seconds, times: [0, 0.999, 1], ease: [ease.inOut, snap] }),
    },
    // a lap round the sun, seen side-on: the earth swings out, shrinks and dims as it passes behind,
    // comes round the other side and back to the front, turning as it goes
    orbit: {
      clip: true,
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=earth]",
            {
              x: [0, 2.5, 0, -2.5, 0],
              y: [0, -1, -2, -1, 0],
              scale: [1, 0.75, 0.6, 0.75, 1],
              opacity: [1, 0.8, 0.55, 0.8, 1],
            },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate("[data-part=land]", TURN, { duration: seconds, times: [0, 0.999, 1], ease: ["linear", snap] }),
        ]),
    },
    // nudged like a desk globe: it tips on its axis and rocks back upright, and the continents slide
    // back and forth with the swing
    wobble: {
      clip: false,
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=earth]",
            { rotate: [0, -22, 14, -6, 0] },
            { duration: seconds, times: [0, 0.25, 0.55, 0.8, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=land]",
            { x: [0, 4, -3, 1, 0] },
            { duration: seconds, times: [0, 0.25, 0.55, 0.8, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => <Drawing />,
})
