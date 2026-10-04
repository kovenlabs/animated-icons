"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "graduation-cap": "toss" | "swing" | "cheer"
  }
}

/** 2 colors: board and cap (primary), cord and tassel (accent). */
export const GraduationCap = createAnimatedIcon({
  name: "graduation-cap",
  category: "education",
  keywords: ["education", "school", "student", "teacher", "diploma", "university", "course", "learning"],
  slots: { primary: "board + cap", accent: "cord + tassel" },
  defaultVariant: "toss",
  variants: {
    // tossed up and caught with a little bounce, the tassel swinging behind it
    toss: {
      duration: 850,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=cap]",
            { y: [0, -2, 0, 0] },
            { duration: seconds, times: [0, 0.4, 0.75, 1], ease: ["easeOut", ease.overshoot, "linear"] },
          ),
          animate(
            "[data-part=tassel]",
            { rotate: [0, 12, -10, 5, 0] },
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
            { rotate: [0, 12, -10, 6, -3, 0] },
            { duration: seconds, delay: seconds * 0.06, ease: "easeInOut" },
          ),
        ]),
    },
    // the cap swells with pride and settles, the tassel flicking in as it does
    cheer: {
      duration: 700,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=cap]",
            { scale: [1, 1.06, 0.98, 1] },
            { duration: seconds, times: [0, 0.35, 0.7, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=tassel]",
            { rotate: [0, 12, -6, 0] },
            { duration: seconds, delay: seconds * 0.1, ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="cap" style={pivot("50% 100%")}>
      {/* the board is a diamond seen from the front, x 3..21: its acute side corners stay inside the frame
          even mitered, and its apex sits low enough for the toss; the cap hangs from its lower edges in a V */}
      <path d="M12 4l9 4.5-9 4.5-9-4.5z" />
      <path d="M7 10.5V16l5 3 5-3v-5.5" />
      {/* the cord runs from the button to the corner, the tassel hangs from there */}
      <path d="M12 8.5h9" stroke={slot.accent} />
      <path data-part="tassel" d="M21 8.5v7" stroke={slot.accent} style={pivot("50% 0%")} />
    </g>
  ),
})
