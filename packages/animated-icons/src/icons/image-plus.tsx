"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"
import { badgeGlyph } from "../lib/parts"

declare module "../lib/types" {
  interface IconVariants {
    "image-plus": "add" | "turn" | "shine"
  }
}

/**
 * The `image` frame with its top-right corner left open for the badge: the top edge and the right wall
 * both stop 2px short of the plus.
 */
const FRAME = "M11 3H3v18h18v-8"

/** One 45° peak rising from the floor and running down into the right wall, clear of the badge. */
const PEAK = "M6 21l9-9 6 6"

/** 3 colors: frame (primary), mountain and sun (secondary), plus (accent). */
export const ImagePlus = createAnimatedIcon({
  name: "image-plus",
  family: "image",
  category: "media",
  keywords: ["add image", "upload photo", "new picture", "insert image", "attach photo", "add media"],
  slots: { primary: "frame", secondary: "mountain + sun", accent: "plus" },
  defaultVariant: "add",
  variants: {
    // the plus spins in from nothing and lands square
    add: {
      duration: 650,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=plus]",
          { scale: [0, 1.12, 1], rotate: [-90, 0, 0], opacity: [0, 1, 1] },
          { duration: seconds, times: [0, 0.7, 1], ease: ease.overshoot },
        ),
    },
    // a quarter turn in place, with a little swell on the way (a plus looks the same at -90°, so it starts there unseen)
    turn: {
      duration: 700,
      run: ({ animate, seconds }) =>
        animate("[data-part=plus]", { rotate: [-90, 0], scale: [1, 1.1, 1] }, { duration: seconds, ease: "easeInOut" }),
    },
    // the sun swells and settles
    shine: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate("[data-part=sun]", { scale: [1, 1.25, 0.95, 1] }, { duration: seconds, times: [0, 0.35, 0.7, 1], ease: ease.out }),
    },
  },
  render: () => (
    <>
      <path d={FRAME} />
      <path d={PEAK} stroke={slot.secondary} />
      {/* the sun is round, so it gets a true circle */}
      <circle data-part="sun" cx="8.5" cy="8.5" r="2" fill={slot.secondary} stroke="none" style={pivot("50% 50%")} />
      <path data-part="plus" d={badgeGlyph.plus()} stroke={slot.accent} style={pivot("50% 50%")} />
    </>
  ),
})
