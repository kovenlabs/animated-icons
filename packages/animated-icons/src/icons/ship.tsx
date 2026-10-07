"use client"

import { useId } from "react"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot, snap } from "../lib/motion"
import { useShapedDrawing } from "../lib/shape"

declare module "../lib/types" {
  interface IconVariants {
    ship: "rock" | "bob"
  }
}

/**
 * A zigzag swell, its crests kept 2px clear of the hull. It runs a period past the left of its strip and
 * two past the right: the distance it rolls.
 */
const PERIOD = 5
const SWELL = `M${Array.from({ length: 15 }, (_, i) => `${-3 + i * 2.5} ${i % 2 === 0 ? 21.5 : 19.5}`).join("L")}`

/**
 * The swell slides inside a window as wide as the drawing, clipped so its ends never show. Drawn in its
 * own component (for the clip id), so it shapes its corners from context.
 */
function Drawing() {
  const clip = `ship-${useId().replace(/[^\w-]/g, "")}`
  return useShapedDrawing(
    <>
      <clipPath id={clip}>
        {/* a polygon, not a path: the window's corners must stay exactly as drawn */}
        <polygon points="1 16 23 16 23 24 1 24" />
      </clipPath>
      <g clipPath={`url(#${clip})`}>
        <path data-part="waves" d={SWELL} stroke={slot.accent} />
      </g>
      <g data-part="ship" style={pivot("50% 100%")}>
        {/* funnel, a cabin standing on the deck, and a flat-decked hull */}
        <path d="M12 3v3.5M6.5 11.5v-5h11v5" />
        <path d="M2 11.5h20l-2.5 4h-15Z" />
      </g>
    </>,
  )
}

/** 2 colors: ship (primary), waves (accent). */
export const Ship = createAnimatedIcon({
  name: "ship",
  category: "transport",
  keywords: ["boat", "ferry", "cruise", "sea", "shipping", "cargo", "maritime"],
  slots: { primary: "ship", accent: "waves" },
  defaultVariant: "rock",
  variants: {
    // rocks from side to side on the swell and settles upright
    rock: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate("[data-part=ship]", { rotate: [0, -8, 6, -4, 2, 0] }, { duration: seconds, ease: "easeInOut" }),
    },
    // the swell rolls by under it, two waves' worth, and lifts it on each crest. The strip ends where it
    // began, a whole number of periods along, so it snaps back to rest unseen
    bob: {
      clip: false,
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=ship]", { y: [0, -2, 0, -2, 0] }, { duration: seconds, ease: "easeInOut" }),
          animate(
            "[data-part=waves]",
            { x: [0, -2 * PERIOD, 0] },
            { duration: seconds, times: [0, 0.995, 1], ease: ["easeInOut", snap] },
          ),
        ]),
    },
  },
  render: () => <Drawing />,
})
