"use client"

import type { Easing } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "git-fork": "fork" | "spread" | "ripple"
  }
}

/** 2 colors: origin and its tine (primary), the forked tine and its tip (accent). */
export const GitFork = createAnimatedIcon({
  name: "git-fork",
  family: "git",
  category: "development",
  keywords: ["fork", "git", "repository", "copy", "version control", "open source", "clone"],
  slots: { primary: "origin + left tine", accent: "forked tine + tip" },
  defaultVariant: "fork",
  variants: {
    // the fork folds over onto the left tine like a page, lies on it for a beat, then turns back out
    // about the stem and springs past flat before it settles; the origin answers with a pop
    fork: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=copy]",
            { scaleX: [1, 0, -1, -1, 0, 1.12, 1] },
            {
              duration: seconds,
              times: [0, 0.16, 0.32, 0.48, 0.62, 0.8, 1],
              ease: ["easeIn", "easeOut", "linear", "easeIn", "easeOut", "easeInOut"],
            },
          ),
          // the page swells as it stands edge-on, nearest the viewer
          animate(
            "[data-part=copy]",
            { scaleY: [1, 1.12, 1, 1, 1.12, 1, 1] },
            { duration: seconds, times: [0, 0.16, 0.32, 0.48, 0.62, 0.8, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=origin]",
            { scale: [1, 1, 1.25, 1] },
            { duration: seconds, times: [0, 0.6, 0.75, 1], ease: ["linear", ease.out, ease.overshoot] },
          ),
        ]),
    },
    // the two tines spring apart and together about the fork's joint, like a tuning fork struck
    spread: {
      duration: 1000,
      run: ({ animate, seconds }) => {
        const timing = { duration: seconds, times: [0, 0.2, 0.45, 0.65, 0.82, 1], ease: "easeInOut" as const }
        return Promise.all([
          animate("[data-part=left]", { rotate: [0, -12, 9, -5, 2, 0] }, timing),
          animate("[data-part=copy]", { rotate: [0, 12, -9, 5, -2, 0] }, timing),
        ])
      },
    },
    // a signal climbs from the origin into both tips: each commit leaps towards the viewer in turn
    ripple: {
      duration: 1000,
      run: ({ animate, seconds }) => {
        const leap = { scale: [1, 1.3, 0.95, 1] }
        const timing = { duration: seconds * 0.55, times: [0, 0.4, 0.75, 1], ease: [ease.out, "easeInOut", "easeOut"] satisfies Easing[] }
        return Promise.all([
          animate("[data-part=origin]", leap, timing),
          animate("[data-part=tip]", leap, { ...timing, delay: seconds * 0.4 }),
        ])
      },
    },
  },
  render: () => (
    <>
      {/* the origin commit and the stem that rises from it; it grows from where the stem meets it */}
      <circle data-part="origin" cx="12" cy="18" r="3" style={pivot("50% 0%")} />
      <path d="M12 12v3" />
      {/* each tine turns about the joint at (12, 12): the right-hand corner of the left one's box, */}
      {/* the left-hand corner of the right one's; tips grow from where their tines meet them */}
      <g data-part="left" style={pivot("100% 100%")}>
        <path d="M12 12H6V9" />
        <circle data-part="tip" cx="6" cy="6" r="3" style={pivot("50% 100%")} />
      </g>
      <g data-part="copy" stroke={slot.accent} style={pivot("0% 100%")}>
        <path d="M12 12h6V9" />
        <circle data-part="tip" cx="18" cy="6" r="3" style={pivot("50% 100%")} />
      </g>
    </>
  ),
})
