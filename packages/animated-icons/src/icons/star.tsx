"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { blink, ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    star: "shine" | "twinkle" | "pop"
  }
}

/** Five mitered points; the box centre sits a little above the star's own centre. */
const STAR = "M12 4.5 14.5 9.5 20 10 16 14 17 19.5 12 17 7 19.5 8 14 4 10 9.5 9.5Z"

/** Small diamonds that only exist in motion. */
const SPARKLES = ["M4 2.5 5.5 4 4 5.5 2.5 4z", "M20 2.5 21.5 4 20 5.5 18.5 4z", "M12 19.5 13.5 21 12 22.5 10.5 21z"]

/** 2 colors: outline (primary), fill and sparkles (accent). */
export const Star = createAnimatedIcon({
  name: "star",
  category: "status",
  keywords: ["favorite", "rating", "bookmark", "featured", "review", "starred"],
  slots: { primary: "outline", accent: "fill + sparkles" },
  defaultVariant: "shine",
  variants: {
    // the core fills the whole star, holds, and shrinks back
    shine: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=fill]",
          { scale: [0.36, 1, 1, 0.36] },
          { duration: seconds, times: [0, 0.35, 0.65, 1], ease: ease.out },
        ),
    },
    // a gentle wobble while the sparkles wink in turn
    twinkle: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=star]", { rotate: [0, -12, 9, -4, 0] }, { duration: seconds, ease: "easeInOut" }),
          animate("[data-part=sparkle]", blink, {
            duration: seconds * 0.6,
            delay: stagger(seconds * 0.12, { startDelay: seconds * 0.1 }),
            ease: "easeOut",
          }),
        ]),
    },
    // a squeeze and a pop, the core swelling with it
    pop: {
      duration: 550,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=star]", { scale: [1, 0.9, 1.15, 1] }, { duration: seconds, ease: ease.out }),
          animate("[data-part=fill]", { scale: [0.36, 0.3, 0.6, 0.36] }, { duration: seconds, ease: ease.out }),
        ]),
    },
  },
  render: () => (
    <>
      <g fill={slot.accent} stroke="none">
        {SPARKLES.map((d) => (
          <path key={d} data-part="sparkle" d={d} style={flash()} />
        ))}
      </g>
      <g data-part="star" style={pivot("50% 55%")}>
        <path
          data-part="fill"
          d={STAR}
          fill={slot.accent}
          stroke="none"
          style={{ ...pivot("50% 55%"), transform: "scale(0.36)" }}
        />
        <path d={STAR} />
      </g>
    </>
  ),
})
