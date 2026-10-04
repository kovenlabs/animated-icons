"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "git-commit": "pulse" | "slide"
  }
}

/** 1 color. The solid core only exists in motion. */
export const GitCommitIcon = createAnimatedIcon({
  name: "git-commit",
  family: "git",
  category: "development",
  keywords: ["commit", "git", "version control", "history", "save", "revision", "changeset"],
  slots: { primary: "line + commit" },
  defaultVariant: "pulse",
  variants: {
    // the commit lands: the node swells and fills solid for a beat
    pulse: {
      duration: 650,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=node]",
            { scale: [1, 1.2, 1] },
            { duration: seconds, times: [0, 0.35, 1], ease: ["easeOut", ease.overshoot] },
          ),
          animate(
            "[data-part=core]",
            { opacity: [0, 1, 0], scale: [0.6, 1.2, 1] },
            { duration: seconds, times: [0, 0.35, 1], ease: "easeOut" },
          ),
        ]),
    },
    // the node slides along the line and back, the two halves stretching to stay joined to it
    slide: {
      duration: 1100,
      run: ({ animate, seconds }) => {
        const timing = { duration: seconds, ease: "easeInOut" as const }
        return Promise.all([
          animate("[data-part=node]", { x: [0, 3, -3, 0] }, timing),
          // each half is 6 long and pinned at its outer end: 3 more or less is ×1.5 or ×0.5
          animate("[data-part=before]", { scaleX: [1, 1.5, 0.5, 1] }, timing),
          animate("[data-part=after]", { scaleX: [1, 0.5, 1.5, 1] }, timing),
        ])
      },
    },
  },
  render: () => (
    <>
      <path data-part="before" d="M3 12h6" style={pivot("0% 50%")} />
      <path data-part="after" d="M15 12h6" style={pivot("100% 50%")} />
      {/* a commit is a node, so it gets a true circle */}
      <g data-part="node" style={pivot("50% 50%")}>
        <circle cx="12" cy="12" r="3" />
        <circle data-part="core" cx="12" cy="12" r="2.5" fill={slot.primary} stroke="none" style={flash()} />
      </g>
    </>
  ),
})
