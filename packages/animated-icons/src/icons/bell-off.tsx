"use client"

import { useId } from "react"

import { createAnimatedIcon } from "../lib/create-icon"
import { useShapedDrawing } from "../lib/shape"
import { ease, pivot, slot } from "../lib/motion"
import { SLASH } from "../lib/parts"

declare module "../lib/types" {
  interface IconVariants {
    "bell-off": "mute" | "shake" | "pop"
  }
}

/**
 * The `bell`, cut 2px clear of the slash: a 6px band along the slash masks it out. The band is a `slash`
 * part too, so it draws on, pops and fades with the slash, and the bell only ever moves behind it.
 */
function Drawing() {
  const mask = `bell-off-${useId().replace(/[^\w-]/g, "")}`
  // drawn in its own component (for the mask id), so it shapes its corners from context
  return useShapedDrawing(
    <>
      <mask id={mask} maskUnits="userSpaceOnUse" x="-4" y="-4" width="32" height="32">
        <rect x="-4" y="-4" width="32" height="32" fill="#fff" stroke="none" />
        <path data-part="slash" d={SLASH} stroke="#000" strokeWidth={6} style={pivot("50% 50%")} />
      </mask>
      <g mask={`url(#${mask})`}>
        <g data-part="bell" style={pivot("50% 0%")}>
          <path d="M12 2v3" />
          {/* a trapezoid: flat crown, straight flanks, flared lip */}
          <path d="M8 5h8l1.5 10 2.5 3H4l2.5-3z" />
          <path d="M10 21h4" />
        </g>
      </g>
      <path data-part="slash" d={SLASH} stroke={slot.accent} style={pivot("50% 50%")} />
    </>
  )
}

/** 2 colors: bell (primary), slash (accent). */
export const BellOffIcon = createAnimatedIcon({
  name: "bell-off",
  family: "bell",
  category: "communication",
  keywords: ["mute", "silent", "notifications off", "do not disturb", "quiet", "unsubscribe"],
  slots: { primary: "bell", accent: "slash" },
  defaultVariant: "mute",
  variants: {
    // the slash fades out and strikes across again from the top-left; the bell gives one muffled shake under it
    mute: {
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
            "[data-part=bell]",
            { rotate: [0, 0, -5, 3, -1, 0] },
            { duration: seconds, times: [0, 0.45, 0.6, 0.75, 0.88, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the bell tries to ring, but only wobbles: small, damped, no clapper swing
    shake: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate("[data-part=bell]", { rotate: [0, -5, 4, -2.5, 1, 0] }, { duration: seconds, ease: "easeInOut" }),
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
