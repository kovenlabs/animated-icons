"use client"

import { useId } from "react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"
import { SLASH } from "../lib/parts"
import { useShapedDrawing } from "../lib/shape"

declare module "../lib/types" {
  interface IconVariants {
    "circle-off": "strike" | "shake" | "pop"
  }
}

/**
 * The circle family's ring, cut 2px clear of a slash that runs corner to corner across the whole frame:
 * a 6px band along the slash masks it out. The band is a `slash` part too, so it draws on, pops and fades
 * with the slash, and the ring only ever moves behind it.
 */
function Drawing() {
  const mask = `circle-off-${useId().replace(/[^\w-]/g, "")}`
  // drawn in its own component (for the mask id), so it shapes its corners from context
  return useShapedDrawing(
    <>
      <mask id={mask} maskUnits="userSpaceOnUse" x="-4" y="-4" width="32" height="32">
        <rect x="-4" y="-4" width="32" height="32" fill="#fff" stroke="none" />
        <path data-part="slash" d={SLASH} stroke="#000" strokeWidth={6} style={pivot("50% 50%")} />
      </mask>
      <g mask={`url(#${mask})`}>
        {/* a ring is round, so it gets a true circle */}
        <circle data-part="ring" cx="12" cy="12" r="10" style={pivot("50% 50%")} />
      </g>
      <path data-part="slash" d={SLASH} stroke={slot.accent} style={pivot("50% 50%")} />
    </>
  )
}

/** 2 colors: ring (primary), slash (accent). */
export const CircleOff = createAnimatedIcon({
  name: "circle-off",
  family: "circle",
  category: "status",
  keywords: ["off", "disabled", "none", "unavailable", "inactive", "empty", "no circle"],
  slots: { primary: "ring", accent: "slash" },
  defaultVariant: "strike",
  variants: {
    // the slash fades out and strikes across again from the top-left; the ring gives a small beat as it lands
    strike: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=slash]",
            { opacity: [1, 0, 0, 1] },
            { duration: seconds * 0.35, times: [0, 0.4, 0.55, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=slash]",
            { pathLength: [1, 1, 0, 1] },
            { duration: seconds * 0.7, times: [0, 0.2, 0.22, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=ring]",
            { scale: [1, 1, 0.92, 1] },
            { duration: seconds, times: [0, 0.6, 0.78, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the ring gives a damped no-no shake behind the still slash
    shake: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate("[data-part=ring]", { rotate: [0, -12, 10, -6, 3, 0] }, { duration: seconds, ease: "easeInOut" }),
    },
    // the slash presses in from its middle
    pop: {
      duration: 450,
      run: ({ animate, seconds }) =>
        animate("[data-part=slash]", { scale: [1, 1.08, 1] }, { duration: seconds, ease: ease.out }),
    },
  },
  render: () => <Drawing />,
})
