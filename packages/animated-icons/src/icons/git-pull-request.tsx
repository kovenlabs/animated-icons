"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "git-pull-request": "open" | "turn" | "approve"
  }
}

/** 2 colors: trunk and its head commit (primary), proposed branch, its arrow and tip (accent). */
export const GitPullRequest = createAnimatedIcon({
  name: "git-pull-request",
  family: "git",
  category: "development",
  keywords: ["pull request", "pr", "git", "code review", "merge request", "version control", "contribution"],
  slots: { primary: "trunk + head commit", accent: "proposed branch + arrow + tip" },
  defaultVariant: "open",
  variants: {
    // the request is opened: the branch climbs out of its tip and bends over towards the trunk, the
    // arrow snaps on with a kick, and the head commit spins round like a coin as it receives it
    open: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=limb]",
            { pathLength: [1, 1, 0, 1, 1] },
            { duration: seconds, times: [0, 0.1, 0.14, 0.48, 1], ease: ["linear", "linear", "easeInOut", "linear"] },
          ),
          // hidden while it's too short to read, so its cap never shows as a dot
          animate(
            "[data-part=limb]",
            { opacity: [1, 0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.1, 0.16, 0.18, 1], ease: "linear" },
          ),
          animate(
            "[data-part=arrow]",
            { scale: [1, 0, 0, 1.45, 1] },
            { duration: seconds, times: [0, 0.1, 0.46, 0.6, 0.78], ease: ["easeIn", "linear", ease.overshoot, "easeOut"] },
          ),
          // a full turn about its vertical axis, swelling as it faces edge-on
          animate(
            "[data-part=head]",
            { scaleX: [1, 1, 0, -1, 0, 1], scaleY: [1, 1, 1.2, 1, 1.2, 1] },
            {
              duration: seconds,
              times: [0, 0.55, 0.66, 0.77, 0.88, 1],
              ease: ["linear", "easeIn", "easeOut", "easeIn", "easeOut"],
            },
          ),
        ]),
    },
    // the whole graph turns once about its vertical axis, like a card spun on a table
    turn: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=graph]",
          { scaleX: [1, 0, -1, 0, 1], scaleY: [1, 1.1, 1, 1.1, 1] },
          { duration: seconds, ease: ["easeIn", "easeOut", "easeIn", "easeOut"] },
        ),
    },
    // the branch nudges towards the trunk, then the head commit swells and fills solid: approved
    approve: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=branch]",
            { x: [0, -1.2, 0.6, 0] },
            { duration: seconds * 0.45, times: [0, 0.4, 0.75, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=head]",
            { scale: [1, 1, 1.3, 1] },
            { duration: seconds, times: [0, 0.35, 0.6, 1], ease: ["linear", ease.out, ease.overshoot] },
          ),
          animate(
            "[data-part=core]",
            { opacity: [0, 0, 1, 1, 0], scale: [0.4, 0.4, 1.1, 1, 1] },
            { duration: seconds, times: [0, 0.35, 0.55, 0.8, 1], ease: "easeOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="graph" style={pivot("50% 50%")}>
      {/* the trunk, topped by the head commit it would merge into */}
      <path d="M6 9v12" />
      <g data-part="head" style={pivot("50% 50%")}>
        <circle cx="6" cy="6" r="3" />
        <circle data-part="core" cx="6" cy="6" r="2.5" fill={slot.primary} stroke="none" style={flash()} />
      </g>
      <g data-part="branch" stroke={slot.accent}>
        {/* drawn from the tip upward, then level towards the trunk; the arrow points at the head */}
        <path data-part="limb" d="M18 15V6h-5" />
        <path data-part="arrow" d="M16 3l-3 3 3 3" style={pivot("0% 50%")} />
        <circle cx="18" cy="18" r="3" />
      </g>
    </g>
  ),
})
