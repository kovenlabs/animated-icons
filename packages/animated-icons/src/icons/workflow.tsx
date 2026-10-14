"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    workflow: "flow" | "flip" | "packet"
  }
}

/** 2 colors: steps (primary), connector and its packet (accent). */
export const Workflow = createAnimatedIcon({
  name: "workflow",
  category: "development",
  keywords: ["automation", "pipeline", "process", "flowchart", "steps", "sequence", "integration"],
  slots: { primary: "steps", accent: "connector + packet" },
  defaultVariant: "flow",
  variants: {
    // the first step squashes down to push, the connector shoots out of it and round the corner, and
    // the next step bulges out as it arrives (hidden while it is too short to read)
    flow: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=source]",
            { scaleY: [1, 0.75, 1.08, 1], scaleX: [1, 1.12, 0.96, 1] },
            { duration: seconds * 0.45, times: [0, 0.45, 0.75, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=connector]",
            { pathLength: [1, 1, 0, 1, 1] },
            { duration: seconds, times: [0, 0.18, 0.2, 0.6, 1], ease: ["linear", "linear", ease.in, "linear"] },
          ),
          animate(
            "[data-part=connector]",
            { opacity: [1, 1, 0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.18, 0.2, 0.24, 0.27, 1], ease: "linear" },
          ),
          animate(
            "[data-part=target]",
            { scale: [1, 1, 1.15, 0.92, 1] },
            { duration: seconds, times: [0, 0.6, 0.72, 0.85, 1], ease: "easeOut" },
          ),
        ]),
    },
    // the steps turn over like cards, the first on its upright axis and the second on its level one,
    // each leaning into the turn; both turn on the point the connector holds, so it stays attached
    flip: {
      duration: 1100,
      run: ({ animate, seconds }) => {
        const timing = { duration: seconds * 0.6, ease: "easeInOut" as const }
        return Promise.all([
          animate("[data-part=source]", { scaleX: [1, -1, 1], skewY: [0, 15, 0, -15, 0] }, timing),
          animate(
            "[data-part=target]",
            { scaleY: [1, -1, 1], skewX: [0, 15, 0, -15, 0] },
            { ...timing, delay: seconds * 0.35 },
          ),
        ])
      },
    },
    // a packet leaves the first step, runs down and round the connector, and the next step gulps it
    // with a squash and stretch
    packet: {
      clip: false,
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=bead]",
            {
              x: [0, 0, 0, 4.5, 4.5],
              y: [0, 0, 5, 5, 5],
              scale: [0, 1, 1, 1, 0],
              opacity: [0, 1, 1, 1, 0],
            },
            { duration: seconds * 0.7, times: [0, 0.15, 0.55, 0.85, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=source]",
            { scaleY: [1, 0.8, 1] },
            { duration: seconds * 0.25, ease: "easeOut" },
          ),
          animate(
            "[data-part=target]",
            { scaleX: [1, 1, 0.8, 1.12, 1], scaleY: [1, 1, 1.15, 0.92, 1] },
            { duration: seconds, times: [0, 0.6, 0.72, 0.85, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      {/* each step turns on the point where the connector meets it: the first on its bottom middle,
          the second on its left middle */}
      <path data-part="source" d="M3 3h7v7H3Z" style={pivot("50% 100%")} />
      <path data-part="target" d="M14 14h7v7h-7Z" style={pivot("0% 50%")} />
      <g stroke={slot.accent}>
        <path data-part="connector" d="M6.5 10v7.5H14" />
      </g>
      {/* a 4px bead riding the connector, centred on (6.5, 12.5) at rest; it only exists in motion */}
      <rect data-part="bead" x="4.5" y="10.5" width="4" height="4" fill={slot.accent} stroke="none" style={flash()} />
    </>
  ),
})
