"use client"

import { useId } from "react"

import { createAnimatedIcon } from "../lib/create-icon"
import { useShapedDrawing } from "../lib/shape"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    image: "rise" | "shift" | "shine"
  }
}

/**
 * Two 45° peaks with a valley between, run on past both sides of the frame so the range can pan
 * without its ends showing. At rest it meets the frame's sides at (3, 17) and (21, 17).
 */
const RIDGE = "M-1 21l10-10 5 5 3-3 7 7"

/**
 * Everything below the ridge raised 2px (1.4px square to its 45° flanks): the sun disappears behind
 * it just before it would touch the mountains' stroke, so it sets into the valley without crossing a line.
 */
const BEHIND = "M-1 19 9 9l5 5 3-3 7 7V25H-1Z"

/**
 * Two masks: the mountains are cut at the frame's inner edge (they pan under it, never across it),
 * and the sun is hidden behind the ridge. Both stay put; only the parts inside them move.
 */
function Drawing() {
  const id = useId().replace(/[^\w-]/g, "")
  const range = `image-range-${id}`
  const sky = `image-sky-${id}`
  // drawn in its own component (for the mask ids), so it shapes its corners from context
  return useShapedDrawing(
    <>
      <mask id={range} maskUnits="userSpaceOnUse" x="-4" y="-4" width="32" height="32">
        <rect x="4" y="4" width="16" height="16" fill="#fff" stroke="none" />
      </mask>
      <mask id={sky} maskUnits="userSpaceOnUse" x="-4" y="-4" width="32" height="32">
        <rect x="-4" y="-4" width="32" height="32" fill="#fff" stroke="none" />
        <path d={BEHIND} fill="#000" stroke="none" />
      </mask>
      <rect x="3" y="3" width="18" height="18" />
      <g mask={`url(#${range})`}>
        <path data-part="mountains" d={RIDGE} stroke={slot.secondary} />
      </g>
      <g mask={`url(#${sky})`}>
        {/* the sun is round, so it gets a true circle */}
        <circle data-part="sun" cx="14" cy="8" r="2" fill={slot.accent} stroke="none" style={pivot("50% 50%")} />
      </g>
    </>,
  )
}

/** 3 colors: frame (primary), mountains (secondary), sun (accent). */
export const Image = createAnimatedIcon({
  name: "image",
  category: "media",
  keywords: ["picture", "photo", "gallery", "landscape", "media", "thumbnail"],
  slots: { primary: "frame", secondary: "mountains", accent: "sun" },
  defaultVariant: "rise",
  variants: {
    // the sun sets into the valley and rises back over it; it travels inside the frame
    rise: {
      clip: false,
      duration: 1200,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=sun]",
          { y: [0, 9, 9, 0] },
          { duration: seconds, times: [0, 0.35, 0.45, 1], ease: "easeInOut" },
        ),
    },
    // the range pans a little under the frame and back, like a camera turning
    shift: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=mountains]",
          { x: [0, -2, 1.5, 0] },
          { duration: seconds, times: [0, 0.35, 0.75, 1], ease: "easeInOut" },
        ),
    },
    // the sun swells and settles
    shine: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=sun]",
          { scale: [1, 1.25, 0.95, 1] },
          { duration: seconds, times: [0, 0.35, 0.7, 1], ease: ease.out },
        ),
    },
  },
  render: () => <Drawing />,
})
