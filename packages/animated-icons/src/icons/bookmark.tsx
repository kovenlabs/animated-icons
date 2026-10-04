"use client"

import { useId } from "react"

import { createAnimatedIcon } from "../lib/create-icon"
import { useShapedDrawing } from "../lib/shape"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    bookmark: "save" | "bounce" | "flutter"
  }
}

/** A ribbon with a V notch cut into its tail. */
const BOOKMARK = "M6 3h12v18l-6-5-6 5z"

/**
 * At rest the fill sits inside the ribbon at 45%, 2px clear of every edge. The ribbon is star-shaped
 * around this pivot, so every scale of it between that and full size stays inside the outline.
 */
const FILL = { ...pivot("50% 35%"), transform: "scale(0.45)" }

/**
 * The flood rises behind the outline, clipped to the ribbon, so it fills the notch exactly. Drawn in
 * its own component (for the clip id), so it shapes its corners from context.
 */
function Drawing() {
  const clip = `bookmark-${useId().replace(/[^\w-]/g, "")}`
  return useShapedDrawing(
    <g data-part="bookmark" style={pivot("50% 0%")}>
      <clipPath id={clip}>
        <path d={BOOKMARK} />
      </clipPath>
      <path data-part="fill" d={BOOKMARK} fill={slot.accent} stroke="none" style={FILL} />
      {/* wider than the ribbon, so its own corners stay outside the clip */}
      <g clipPath={`url(#${clip})`}>
        <rect data-part="flood" x="4" y="2" width="16" height="20" fill={slot.accent} stroke="none" style={{ opacity: 0 }} />
      </g>
      <path d={BOOKMARK} />
    </g>,
  )
}

/** 2 colors: outline (primary), fill (accent). */
export const Bookmark = createAnimatedIcon({
  name: "bookmark",
  category: "actions",
  keywords: ["save", "favorite", "read later", "bookmarks", "keep", "saved", "tag"],
  slots: { primary: "outline", accent: "fill" },
  defaultVariant: "save",
  variants: {
    // the fill rises from the tail to the top, the ribbon gives a small pop, then the flood fades back
    // to the resting fill
    save: {
      clip: false,
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=flood]",
            { y: [20, 0, 0, 0], opacity: [1, 1, 1, 0] },
            { duration: seconds, times: [0, 0.45, 0.7, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=bookmark]",
            { scale: [1, 1, 1.06, 1] },
            { duration: seconds * 0.7, times: [0, 0.6, 0.8, 1], ease: ease.out },
          ),
        ]),
    },
    // a small hop that lands with a squash
    bounce: {
      duration: 650,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=bookmark]",
          { y: [0, -2.5, 0, 0], scaleY: [1, 1.03, 0.95, 1] },
          { duration: seconds, times: [0, 0.4, 0.7, 1], ease: "easeOut" },
        ),
    },
    // hangs from its top edge and the notched tail sways like a ribbon in a draught
    flutter: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate("[data-part=bookmark]", { skewX: [0, 8, -6, 3, 0] }, { duration: seconds, ease: "easeInOut" }),
    },
  },
  render: () => <Drawing />,
})
