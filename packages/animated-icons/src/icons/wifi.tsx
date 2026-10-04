"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    wifi: "connect" | "search" | "drop"
  }
}

/** The arcs' shared centre, the middle of the dot. */
const CY = 20
const fmt = (n: number) => String(Math.round(n * 1000) / 1000)

/** A true arc of radius r over the dot, a quarter turn wide (45° either side of straight up). */
function arc(r: number) {
  const d = r * Math.SQRT1_2
  return `M${fmt(12 - d)} ${fmt(CY - d)}A${r} ${r} 0 0 1 ${fmt(12 + d)} ${fmt(CY - d)}`
}

/** Inner to outer, 4.5 apart so the gaps stay 2.5 clear. */
const ARCS = [
  { part: "arc-1", d: arc(5) },
  { part: "arc-2", d: arc(9.5) },
  { part: "arc-3", d: arc(14) },
] as const

const sel = (part: string) => `[data-part=${part}]`

/** A dimmed bar: still there, just not lit. */
const DIM = 0.2

/** 2 colors: arcs (primary), dot (accent). */
export const Wifi = createAnimatedIcon({
  name: "wifi",
  category: "devices",
  keywords: ["wireless", "signal", "internet", "network", "connection", "hotspot", "online"],
  slots: { primary: "arcs", accent: "dot" },
  defaultVariant: "connect",
  variants: {
    // the bars go dark, the dot pings, and the bars light up again one by one from the dot outward
    connect: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            sel("dot"),
            { scale: [1, 1, 1.2, 1] },
            { duration: seconds, times: [0, 0.12, 0.25, 0.4], ease: "easeOut" },
          ),
          ...ARCS.map(({ part }, i) =>
            animate(
              sel(part),
              { opacity: [1, DIM, DIM, 1, 1] },
              { duration: seconds, times: [0, 0.12, 0.3 + i * 0.18, 0.45 + i * 0.18, 1], ease: "easeOut" },
            ),
          ),
        ]),
    },
    // looking for a network: two dim ripples run out from a pulsing dot
    search: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(sel("dot"), { scale: [1, 1.2, 1, 1.2, 1] }, { duration: seconds * 0.8, ease: "easeInOut" }),
          ...ARCS.map(({ part }, i) =>
            animate(
              sel(part),
              { opacity: [1, DIM, 1, DIM, 1] },
              { duration: seconds * 0.76, delay: seconds * 0.12 * i, ease: "easeInOut" },
            ),
          ),
        ]),
    },
    // the signal drops out from the top bar down, the dot flickers alone, then everything comes back at once
    drop: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          ...[...ARCS].reverse().map(({ part }, k) =>
            animate(
              sel(part),
              { opacity: [1, 1, DIM, DIM, 1, 1] },
              { duration: seconds, times: [0, 0.05 + k * 0.13, 0.18 + k * 0.13, 0.7, 0.82, 1], ease: "easeInOut" },
            ),
          ),
          animate(
            sel("dot"),
            { opacity: [1, 1, 0.3, 1, 0.3, 1, 1] },
            { duration: seconds, times: [0, 0.45, 0.51, 0.57, 0.63, 0.7, 1], ease: "linear" },
          ),
          animate(
            sel("dot"),
            { scale: [1, 1, 1.2, 1] },
            { duration: seconds, times: [0, 0.7, 0.82, 1], ease: "easeOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      {/* a router's arcs are round, so they are true arcs */}
      {ARCS.map(({ part, d }) => (
        <path key={part} data-part={part} d={d} />
      ))}
      <rect data-part="dot" x="10.5" y={CY - 1.5} width="3" height="3" fill={slot.accent} stroke="none" style={pivot("50% 50%")} />
    </>
  ),
})
