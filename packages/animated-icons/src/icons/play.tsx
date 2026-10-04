"use client"

import { useId } from "react"

import { createAnimatedIcon } from "../lib/create-icon"
import { useShapedDrawing } from "../lib/shape"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    play: "press" | "wipe" | "nudge"
  }
}

/** A right-pointing triangle: a flat back edge and a single point. */
const TRIANGLE = "M6 4v16l13-8Z"

/**
 * The fill sits under the outline, behind a mask whose window wipes from the back edge toward the
 * point. The window is the only thing that moves, so the fill never changes shape.
 */
function Drawing() {
  const mask = `play-${useId().replace(/[^\w-]/g, "")}`
  // drawn in its own component (for the mask id), so it shapes its corners from context
  return useShapedDrawing(
    <>
      <mask id={mask} maskUnits="userSpaceOnUse" x="-4" y="-4" width="32" height="32">
        <rect data-part="wipe" x="5" y="2" width="15" height="20" fill="#fff" stroke="none" style={pivot("0% 50%")} />
      </mask>
      <g data-part="play" style={pivot("40% 50%")}>
        <g mask={`url(#${mask})`}>
          <path d={TRIANGLE} fill={slot.accent} stroke="none" />
        </g>
        <path d={TRIANGLE} />
      </g>
    </>,
  )
}

/** 2 colors: outline (primary), fill (accent). */
export const Play = createAnimatedIcon({
  name: "play",
  category: "media",
  keywords: ["start", "resume", "video", "audio", "player", "media", "run"],
  slots: { primary: "outline", accent: "fill" },
  defaultVariant: "press",
  variants: {
    // pressed like a button: dips, then springs back a touch past full size
    press: {
      duration: 500,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=play]",
          { scale: [1, 0.86, 1.06, 1] },
          { duration: seconds, times: [0, 0.3, 0.65, 1], ease: ease.out },
        ),
    },
    // the fill drains back to the flat edge, then wipes forward to the point again
    wipe: {
      duration: 850,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=wipe]",
          { scaleX: [1, 0, 1] },
          { duration: seconds, times: [0, 0.3, 1], ease: "easeInOut" },
        ),
    },
    // leans forward, the way it is about to go, and settles
    nudge: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=play]",
          { x: [0, 2.5, -0.5, 0] },
          { duration: seconds, times: [0, 0.4, 0.75, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => <Drawing />,
})
