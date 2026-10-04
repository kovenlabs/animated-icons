"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { blink, ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "graduation-cap": "toss" | "swing" | "cheer"
  }
}

/** Short bursts in the empty corners above the board, for the cheer. */
const RAYS = ["M6.5 2v2", "M3 4h2", "M17.5 2v2", "M21 4h-2"]

/** 2 colors: board and cap (primary), cord and tassel (accent). */
export const GraduationCapIcon = createAnimatedIcon({
  name: "graduation-cap",
  category: "social",
  keywords: ["education", "school", "student", "teacher", "diploma", "university", "course", "learning"],
  slots: { primary: "board + cap", accent: "cord + tassel + rays" },
  defaultVariant: "toss",
  variants: {
    // tossed up with a little turn and caught, the tassel swinging behind it
    toss: {
      duration: 850,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=cap]",
            { y: [0, -3, 0, 0], rotate: [0, -10, 0, 0] },
            { duration: seconds, times: [0, 0.4, 0.75, 1], ease: ease.overshoot },
          ),
          animate(
            "[data-part=tassel]",
            { rotate: [0, 14, -10, 5, 0] },
            { duration: seconds, delay: seconds * 0.1, ease: "easeInOut" },
          ),
        ]),
    },
    // the cap rocks on the head and the tassel swings the other way
    swing: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=cap]",
            { rotate: [0, -5, 4, -2, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=tassel]",
            { rotate: [0, 14, -12, 7, -3, 0] },
            { duration: seconds, delay: seconds * 0.06, ease: "easeInOut" },
          ),
        ]),
    },
    // the cap pops and a burst goes up from its corners
    cheer: {
      duration: 700,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=cap]", { scale: [1, 1.12, 0.97, 1] }, { duration: seconds, ease: ease.out }),
          animate("[data-part=ray]", blink, { duration: seconds * 0.8, delay: seconds * 0.15, ease: "easeOut" }),
        ]),
    },
  },
  render: () => (
    <>
      <g stroke={slot.accent}>
        {RAYS.map((d) => (
          <path key={d} data-part="ray" d={d} style={flash()} />
        ))}
      </g>
      <g data-part="cap" style={pivot("50% 100%")}>
        {/* the board is a diamond seen from the front; the cap hangs from its lower edges in a V */}
        <path d="M12 3l10 5-10 5L2 8z" />
        <path d="M7 10.5V16l5 3 5-3v-5.5" />
        {/* the cord runs from the button to the corner, the tassel hangs from there */}
        <path d="M12 8h10" stroke={slot.accent} />
        <path data-part="tassel" d="M22 8v7" stroke={slot.accent} style={pivot("50% 0%")} />
      </g>
    </>
  ),
})
