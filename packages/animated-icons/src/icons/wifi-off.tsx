"use client"

import { useId } from "react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"
import { SLASH } from "../lib/parts"
import { useShapedDrawing } from "../lib/shape"

declare module "../lib/types" {
  interface IconVariants {
    "wifi-off": "drop" | "search" | "pop"
  }
}

/** The arcs' shared centre, the middle of the dot, as in `wifi`. */
const CY = 20
const fmt = (n: number) => String(Math.round(n * 1000) / 1000)

/** A true arc of radius r over the dot, a quarter turn wide (45° either side of straight up). */
function arc(r: number) {
  const d = r * Math.SQRT1_2
  return `M${fmt(12 - d)} ${fmt(CY - d)}A${r} ${r} 0 0 1 ${fmt(12 + d)} ${fmt(CY - d)}`
}

/** The `wifi` arcs, inner to outer, 4.5 apart. */
const ARCS = [
  { part: "arc-1", d: arc(5) },
  { part: "arc-2", d: arc(9.5) },
  { part: "arc-3", d: arc(14) },
] as const

const sel = (part: string) => `[data-part=${part}]`

/** A dimmed bar: still there, just not lit. */
const DIM = 0.2

/**
 * The `wifi` arcs and dot, cut 2px clear of the slash: a 6px band along the slash masks them out. The
 * band is a `slash` part too, so it draws on, pops and fades with the slash.
 */
function Drawing() {
  const mask = `wifi-off-${useId().replace(/[^\w-]/g, "")}`
  // drawn in its own component (for the mask id), so it shapes its corners from context
  return useShapedDrawing(
    <>
      <mask id={mask} maskUnits="userSpaceOnUse" x="-4" y="-4" width="32" height="32">
        <rect x="-4" y="-4" width="32" height="32" fill="#fff" stroke="none" />
        <path data-part="slash" d={SLASH} stroke="#000" strokeWidth={6} style={pivot("50% 50%")} />
      </mask>
      <g mask={`url(#${mask})`}>
        {/* a router's arcs are round, so they are true arcs */}
        {ARCS.map(({ part, d }) => (
          <path key={part} data-part={part} d={d} />
        ))}
        <rect data-part="dot" x="10.5" y={CY - 1.5} width="3" height="3" fill={slot.primary} stroke="none" style={pivot("50% 50%")} />
      </g>
      <path data-part="slash" d={SLASH} stroke={slot.accent} style={pivot("50% 50%")} />
    </>,
  )
}

/** 2 colors: arcs and dot (primary), slash (accent). */
export const WifiOff = createAnimatedIcon({
  name: "wifi-off",
  family: "wifi",
  category: "devices",
  keywords: ["offline", "no internet", "disconnected", "no signal", "connection lost", "network off", "airplane mode"],
  slots: { primary: "arcs + dot", accent: "slash" },
  defaultVariant: "drop",
  variants: {
    // the slash fades out and strikes across again from the top-left; the arcs go dark under it from the
    // outer one inward, then come back
    drop: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(sel("slash"), { opacity: [1, 0, 0, 1] }, { duration: seconds * 0.3, times: [0, 0.4, 0.55, 1], ease: "easeOut" }),
          animate(sel("slash"), { pathLength: [1, 1, 0, 1] }, { duration: seconds * 0.6, times: [0, 0.2, 0.22, 1], ease: "easeOut" }),
          ...[...ARCS].reverse().map(({ part }, k) =>
            animate(
              sel(part),
              { opacity: [1, 1, DIM, DIM, 1] },
              { duration: seconds, times: [0, 0.3 + k * 0.1, 0.45 + k * 0.1, 0.75, 1], ease: "easeInOut" },
            ),
          ),
        ]),
    },
    // still looking for a network: the dot pulses and dim ripples run out through the arcs, finding nothing
    search: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(sel("dot"), { scale: [1, 1.25, 1, 1.25, 1] }, { duration: seconds * 0.8, ease: "easeInOut" }),
          ...ARCS.map(({ part }, i) =>
            animate(
              sel(part),
              { opacity: [1, DIM, 1, DIM, 1] },
              { duration: seconds * 0.76, delay: seconds * 0.12 * i, ease: "easeInOut" },
            ),
          ),
        ]),
    },
    // the slash presses in from its middle
    pop: {
      duration: 450,
      run: ({ animate, seconds }) => animate(sel("slash"), { scale: [1, 1.08, 1] }, { duration: seconds, ease: ease.out }),
    },
  },
  render: () => <Drawing />,
})
