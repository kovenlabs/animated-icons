"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "git-merge": "merge" | "pulse"
  }
}

/** 2 colors: trunk and its head commit (primary), incoming branch and its tip (accent). */
export const GitMergeIcon = createAnimatedIcon({
  name: "git-merge",
  family: "git",
  category: "development",
  keywords: ["merge", "git", "pull request", "version control", "combine", "join", "integrate"],
  slots: { primary: "trunk + head commit", accent: "incoming branch + tip" },
  defaultVariant: "merge",
  variants: {
    // the branch flows from its tip into the trunk, and the head commit pops as the merge lands
    merge: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=limb]",
            { pathLength: [1, 1, 0, 1, 1] },
            { duration: seconds, times: [0, 0.15, 0.2, 0.6, 1], ease: ["linear", "linear", "easeInOut", "linear"] },
          ),
          // hidden while it's too short to read, so its cap never shows as a dot
          animate(
            "[data-part=limb]",
            { opacity: [1, 0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.15, 0.22, 0.24, 1], ease: "linear" },
          ),
          animate(
            "[data-part=head]",
            { scale: [1, 1, 1.2, 1] },
            { duration: seconds, times: [0, 0.58, 0.78, 1], ease: ["linear", ease.out, "easeInOut"] },
          ),
        ]),
    },
    // a signal passes through: the tip pulses, then the head commit answers
    pulse: {
      duration: 900,
      run: ({ animate, seconds }) => {
        const beat = { scale: [1, 1.2, 1] }
        const timing = { duration: seconds * 0.5, ease: "easeInOut" as const }
        return Promise.all([
          animate("[data-part=tip]", beat, timing),
          animate("[data-part=head]", beat, { ...timing, delay: seconds * 0.5 }),
        ])
      },
    },
  },
  render: () => (
    <>
      <circle data-part="head" cx="6" cy="6" r="3" style={pivot("50% 50%")} />
      <path d="M6 9v12" />
      <g stroke={slot.accent}>
        {/* drawn from the tip into the trunk: level out of the tip, then a 45° climb into the trunk */}
        <path data-part="limb" d="M15 18h-3l-6-6" />
        <circle data-part="tip" cx="18" cy="18" r="3" style={pivot("50% 50%")} />
      </g>
    </>
  ),
})
