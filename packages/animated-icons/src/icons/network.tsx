"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    network: "broadcast" | "flip" | "ping"
  }
}

/** The two leaf nodes, 5px boxes, and the link from the hub down to each (drawn hub-outward). */
const LEAVES = [
  { node: "M3 16h5v5H3Z", link: "M12 8v4H5.5v4" },
  { node: "M16 16h5v5h-5Z", link: "M12 8v4h6.5v4" },
] as const

/** 2 colors: nodes (primary), links and packets (accent). */
export const Network = createAnimatedIcon({
  name: "network",
  category: "development",
  keywords: ["topology", "hierarchy", "lan", "connection", "nodes", "infrastructure", "tree", "org chart"],
  slots: { primary: "nodes", accent: "links + packets" },
  defaultVariant: "broadcast",
  variants: {
    // the hub squashes and bursts, the links shoot down out of it, and each leaf pops as its link
    // lands (links hidden while they are too short to read)
    broadcast: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=hub]",
            { scaleY: [1, 0.7, 1.2, 1], scaleX: [1, 1.2, 0.9, 1] },
            { duration: seconds * 0.4, times: [0, 0.4, 0.7, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=link]",
            { pathLength: [1, 1, 0, 1, 1] },
            { duration: seconds, times: [0, 0.15, 0.17, 0.55, 1], ease: ["linear", "linear", ease.in, "linear"] },
          ),
          animate(
            "[data-part=link]",
            { opacity: [1, 1, 0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.15, 0.17, 0.2, 0.23, 1], ease: "linear" },
          ),
          animate(
            "[data-part=leaf]",
            { scale: [1, 1, 1.18, 0.9, 1] },
            {
              duration: seconds * 0.45,
              times: [0, 0.05, 0.4, 0.7, 1],
              delay: stagger(seconds * 0.08, { startDelay: seconds * 0.5 }),
              ease: "easeOut",
            },
          ),
        ]),
    },
    // the nodes turn over like cards in a cascade, the hub first and then each leaf, leaning into the
    // turn for perspective
    flip: {
      duration: 1200,
      run: ({ animate, seconds }) => {
        const toss = { scaleX: [1, -1, 1], skewY: [0, 15, 0, -15, 0], scale: [1, 1.1, 1] }
        const timing = { duration: seconds * 0.55, ease: "easeInOut" as const }
        return Promise.all([
          animate("[data-part=hub]", toss, timing),
          animate("[data-part=leaf]", toss, { ...timing, delay: stagger(seconds * 0.15, { startDelay: seconds * 0.25 }) }),
        ])
      },
    },
    // packets climb out of both leaves, run in along the bar, meet under the hub, and the hub flares as
    // it takes them in
    ping: {
      clip: false,
      duration: 1200,
      run: ({ animate, seconds }) => {
        const timing = { duration: seconds * 0.7, times: [0, 0.1, 0.3, 0.75, 0.9, 1], ease: "easeInOut" as const }
        const climb = { scale: [0, 1, 1, 1, 1, 0], opacity: [0, 1, 1, 1, 1, 0], y: [0, 0, -2, -2, -2.5, -2.5] }
        return Promise.all([
          animate("[data-part=bead-left]", { ...climb, x: [0, 0, 0, 6.5, 6.5, 6.5] }, timing),
          animate("[data-part=bead-right]", { ...climb, x: [0, 0, 0, -6.5, -6.5, -6.5] }, timing),
          animate(
            "[data-part=hub]",
            { scale: [1, 1, 1.2, 0.92, 1] },
            { duration: seconds, times: [0, 0.55, 0.68, 0.82, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=leaf]",
            { scaleY: [1, 0.8, 1] },
            { duration: seconds * 0.25, ease: "easeOut" },
          ),
        ])
      },
    },
  },
  render: () => (
    <>
      {/* the hub grows from where its stem leaves it */}
      <path data-part="hub" d="M9.5 3h5v5h-5Z" style={pivot("50% 100%")} />
      {LEAVES.map(({ node }) => (
        <path key={node} data-part="leaf" d={node} style={pivot("50% 50%")} />
      ))}
      <g stroke={slot.accent}>
        {LEAVES.map(({ link }) => (
          <path key={link} data-part="link" d={link} />
        ))}
      </g>
      {/* 4px beads riding the links, centred just above each leaf at rest; they only exist in motion */}
      <g fill={slot.accent} stroke="none">
        <rect data-part="bead-left" x="3.5" y="12" width="4" height="4" style={flash()} />
        <rect data-part="bead-right" x="16.5" y="12" width="4" height="4" style={flash()} />
      </g>
    </>
  ),
})
