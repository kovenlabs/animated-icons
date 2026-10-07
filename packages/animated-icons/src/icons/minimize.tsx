"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    minimize: "shrink" | "turn" | "dock"
  }
}

/** 1 color: two diagonal arrows pointing in from opposite corners. */
export const Minimize = createAnimatedIcon({
  name: "minimize",
  category: "layout",
  keywords: ["exit fullscreen", "collapse", "shrink", "reduce", "contract", "resize", "smaller"],
  slots: { primary: "corner arrows" },
  defaultVariant: "shrink",
  variants: {
    // the whole frame sinks away from you as both arrows press in, then springs back past rest
    shrink: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=arrows]",
            { scale: [1, 0.72, 1.08, 0.98, 1] },
            { duration: seconds, times: [0, 0.4, 0.7, 0.85, 1], ease: ["easeOut", ease.overshoot, "easeInOut", "easeOut"] },
          ),
          animate(
            "[data-part=ne]",
            { x: [0, -0.5, 0.5, 0], y: [0, 0.5, -0.5, 0] },
            { duration: seconds, times: [0, 0.4, 0.7, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=sw]",
            { x: [0, 0.5, -0.5, 0], y: [0, -0.5, 0.5, 0] },
            { duration: seconds, times: [0, 0.4, 0.7, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the arrows turn right round on a vertical axis, so for a moment they point in from the other corners
    turn: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=arrows]",
          { scaleX: [1, -1, 1], scale: [1, 1.1, 1] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    // sucked down into the dock to a flat line, then pops back up with a stretch
    dock: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=window]",
          { scaleY: [1, 0.12, 0.12, 1.15, 0.96, 1], scaleX: [1, 0.6, 0.6, 1.05, 1, 1], y: [0, 1.5, 1.5, -1, 0, 0] },
          { duration: seconds, times: [0, 0.35, 0.5, 0.75, 0.88, 1], ease: [ease.in, "linear", ease.out, "easeInOut", "easeOut"] },
        ),
    },
  },
  render: () => (
    <g data-part="window" style={pivot("50% 100%")}>
      <g data-part="arrows" style={pivot("50% 50%")}>
        {/* maximize turned inside out: each right-angled head sits at the inner end, its shaft stopping short
            of the point */}
        <g data-part="ne">
          <path d="M14 4v6h6" />
          <path d="M15 9l5-5" />
        </g>
        <g data-part="sw">
          <path d="M4 14h6v6" />
          <path d="M9 15l-5 5" />
        </g>
      </g>
    </g>
  ),
})
