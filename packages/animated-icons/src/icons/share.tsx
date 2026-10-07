"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    share: "spread" | "pulse" | "flex"
  }
}

/** 2 colors: nodes (primary), links (accent). */
export const Share = createAnimatedIcon({
  name: "share",
  category: "social",
  keywords: ["social", "network", "send to", "distribute", "connect", "export", "forward"],
  slots: { primary: "nodes", accent: "links" },
  defaultVariant: "spread",
  variants: {
    // the links fold back into the source and grow out again, each receiver popping as its link arrives
    spread: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=link]",
            { pathLength: [1, 1, 0, 1, 1] },
            { duration: seconds, times: [0, 0.15, 0.25, 0.6, 1], ease: ["linear", "easeIn", "easeOut", "linear"] },
          ),
          // hidden while too short to read, so the caps never show as dots
          animate(
            "[data-part=link]",
            { opacity: [1, 1, 0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.2, 0.24, 0.27, 0.31, 1], ease: "linear" },
          ),
          animate(
            "[data-part=receiver]",
            { scale: [1, 1, 1.2, 1] },
            { duration: seconds, times: [0, 0.58, 0.75, 1], ease: ["linear", ease.overshoot, "easeOut"] },
          ),
        ]),
    },
    // a beat passes from the source to each receiver in turn
    pulse: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=source], [data-part=receiver]",
          { scale: [1, 1.2, 1] },
          { duration: seconds * 0.5, delay: stagger(seconds * 0.22), ease: "easeInOut" },
        ),
    },
    // both branches flex in towards each other on the source and spring back
    flex: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=upper]", { rotate: [0, 8, -3, 0] }, { duration: seconds, ease: "easeInOut" }),
          animate("[data-part=lower]", { rotate: [0, -8, 3, 0] }, { duration: seconds, ease: "easeInOut" }),
        ]),
    },
  },
  render: () => (
    <>
      {/* nodes are round, so they get true circles: the source on the left, two receivers on the right */}
      <circle data-part="source" cx="6" cy="12" r="3" style={pivot("50% 50%")} />
      {/* each branch pivots where its link leaves the source */}
      <g data-part="upper" style={pivot("0% 100%")}>
        <path data-part="link" d="M8.5 10.5l7-4" stroke={slot.accent} />
        <circle data-part="receiver" cx="18" cy="5" r="3" style={pivot("50% 50%")} />
      </g>
      <g data-part="lower" style={pivot("0% 0%")}>
        <path data-part="link" d="M8.5 13.5l7 4" stroke={slot.accent} />
        <circle data-part="receiver" cx="18" cy="19" r="3" style={pivot("50% 50%")} />
      </g>
    </>
  ),
})
