"use client"

import { useId } from "react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"
import { SLASH } from "../lib/parts"
import { useShapedDrawing } from "../lib/shape"

declare module "../lib/types" {
  interface IconVariants {
    "server-off": "shutdown" | "flicker" | "pop"
  }
}

/**
 * Status lights 2 clear of the slash's band: the top unit's sit at its right end, the bottom unit's at
 * its left end, so the slash runs between them. The drive bays are left out, since the band would cut
 * them in half.
 */
const LIGHTS = [
  { part: "light-1", x: 13, y: 5.5 },
  { part: "light-2", x: 17, y: 5.5 },
  { part: "light-3", x: 5, y: 16.5 },
  { part: "light-4", x: 9, y: 16.5 },
] as const

const sel = (part: string) => `[data-part=${part}]`

/**
 * The `server` rack, cut 2px clear of the slash: a 6px band along the slash masks it out. The band is a
 * `slash` part too, so it draws on, pops and fades with the slash.
 */
function Drawing() {
  const mask = `server-off-${useId().replace(/[^\w-]/g, "")}`
  // drawn in its own component (for the mask id), so it shapes its corners from context
  return useShapedDrawing(
    <>
      <mask id={mask} maskUnits="userSpaceOnUse" x="-4" y="-4" width="32" height="32">
        <rect x="-4" y="-4" width="32" height="32" fill="#fff" stroke="none" />
        <path data-part="slash" d={SLASH} stroke="#000" strokeWidth={6} style={pivot("50% 50%")} />
      </mask>
      <g mask={`url(#${mask})`}>
        <g data-part="rack" style={pivot("50% 50%")}>
          {/* two rack units, as in `server` */}
          <path d="M2 3h20v7H2Z" />
          <path d="M2 14h20v7H2Z" />
          <g fill={slot.secondary} stroke="none">
            {LIGHTS.map(({ part, x, y }) => (
              <rect key={part} data-part={part} x={x} y={y} width="2" height="2" />
            ))}
          </g>
        </g>
      </g>
      <path data-part="slash" d={SLASH} stroke={slot.accent} style={pivot("50% 50%")} />
    </>,
  )
}

/** 3 colors: rack units (primary), status lights (secondary), slash (accent). */
export const ServerOff = createAnimatedIcon({
  name: "server-off",
  family: "server",
  category: "development",
  keywords: ["server down", "offline", "outage", "unavailable", "backend down", "disconnected", "no service"],
  slots: { primary: "rack units", secondary: "status lights", accent: "slash" },
  defaultVariant: "shutdown",
  variants: {
    // the slash fades out and strikes across again from the top-left; the status lights go out one by
    // one under it and come back on together
    shutdown: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(sel("slash"), { opacity: [1, 0, 0, 1] }, { duration: seconds * 0.3, times: [0, 0.4, 0.55, 1], ease: "easeOut" }),
          animate(sel("slash"), { pathLength: [1, 1, 0, 1] }, { duration: seconds * 0.6, times: [0, 0.2, 0.22, 1], ease: "easeOut" }),
          ...LIGHTS.map(({ part }, i) =>
            animate(
              sel(part),
              { opacity: [1, 1, 0, 0, 1] },
              { duration: seconds, times: [0, 0.3 + i * 0.08, 0.36 + i * 0.08, 0.8, 0.92], ease: "easeOut" },
            ),
          ),
        ]),
    },
    // the lights sputter like a failing supply, each on its own beat, then hold steady
    flicker: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all(
          LIGHTS.map(({ part }, i) =>
            animate(
              sel(part),
              { opacity: [1, 0, 1, 0, 1] },
              { duration: seconds * 0.6, delay: seconds * 0.1 * i, times: [0, 0.2, 0.45, 0.7, 1], ease: "linear" },
            ),
          ),
        ),
    },
    // the slash presses in from its middle
    pop: {
      duration: 450,
      run: ({ animate, seconds }) => animate(sel("slash"), { scale: [1, 1.08, 1] }, { duration: seconds, ease: ease.out }),
    },
  },
  render: () => <Drawing />,
})
