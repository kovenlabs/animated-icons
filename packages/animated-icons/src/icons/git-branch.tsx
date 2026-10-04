"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "git-branch": "grow" | "sway"
  }
}

/** 2 colors: trunk and its commit (primary), branch and its tip (accent). */
export const GitBranchIcon = createAnimatedIcon({
  name: "git-branch",
  family: "git",
  category: "development",
  keywords: ["branch", "git", "fork", "version control", "checkout", "feature branch", "source control"],
  slots: { primary: "trunk + commit", accent: "branch + tip" },
  defaultVariant: "grow",
  variants: {
    // the branch folds away, then grows back out of the trunk and its tip commit pops on the end
    grow: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=limb]",
            { pathLength: [1, 1, 0, 1, 1] },
            { duration: seconds, times: [0, 0.18, 0.22, 0.62, 1], ease: ["linear", "linear", "easeOut", "linear"] },
          ),
          // hidden while it's too short to read, so its cap never shows as a dot
          animate(
            "[data-part=limb]",
            { opacity: [1, 0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.18, 0.24, 0.26, 1], ease: "linear" },
          ),
          animate(
            "[data-part=tip]",
            { scale: [1, 0, 0, 1.15, 1] },
            {
              duration: seconds,
              times: [0, 0.18, 0.55, 0.8, 1],
              ease: ["easeIn", "linear", ease.overshoot, "easeOut"],
            },
          ),
        ]),
    },
    // the branch sways on the point where it leaves the trunk
    sway: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate("[data-part=branch]", { rotate: [0, 9, -6, 3, 0] }, { duration: seconds, ease: "easeInOut" }),
    },
  },
  render: () => (
    <>
      <path d="M6 3v12" />
      <circle cx="6" cy="18" r="3" />
      {/* pivots where it leaves the trunk: the bottom-left of its box */}
      <g data-part="branch" stroke={slot.accent} style={pivot("0% 100%")}>
        {/* drawn from the trunk outward: a 45° rise, then level into the tip */}
        <path data-part="limb" d="M6 12l6-6h3" />
        <circle data-part="tip" cx="18" cy="6" r="3" style={pivot("50% 50%")} />
      </g>
    </>
  ),
})
