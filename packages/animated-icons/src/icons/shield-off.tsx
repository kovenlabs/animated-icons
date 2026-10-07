"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"
import { SLASH } from "../lib/parts"
import { useShapedDrawing } from "../lib/shape"
import { useId } from "react"

declare module "../lib/types" {
  interface IconVariants {
    "shield-off": "revoke" | "shake" | "pop"
  }
}

/**
 * The `shield`, cut 2px clear of the slash: a 6px band along the slash masks it out. The centre line is
 * left out, since the band would cut it into stubs. The band is a `slash` part too, so it draws on, pops
 * and fades with the slash, and the shield only ever moves behind it.
 */
function Drawing() {
  const mask = `shield-off-${useId().replace(/[^\w-]/g, "")}`
  // drawn in its own component (for the mask id), so it shapes its corners from context
  return useShapedDrawing(
    <>
      <mask id={mask} maskUnits="userSpaceOnUse" x="-4" y="-4" width="32" height="32">
        <rect x="-4" y="-4" width="32" height="32" fill="#fff" stroke="none" />
        <path data-part="slash" d={SLASH} stroke="#000" strokeWidth={6} style={pivot("50% 50%")} />
      </mask>
      <g mask={`url(#${mask})`}>
        {/* the shield family's faceted outline: flat shoulders, straight sides, three facets down to the point */}
        <path data-part="shield" d="M12 2l8 3v7l-3 5-5 4-5-4-3-5V5z" style={pivot("50% 50%")} />
      </g>
      <path data-part="slash" d={SLASH} stroke={slot.accent} style={pivot("50% 50%")} />
    </>,
  )
}

/** 2 colors: shield (primary), slash (accent). */
export const ShieldOff = createAnimatedIcon({
  name: "shield-off",
  family: "shield",
  category: "security",
  keywords: ["revoke", "unprotected", "insecure", "disable", "security off", "remove access", "unsafe"],
  slots: { primary: "shield", accent: "slash" },
  defaultVariant: "revoke",
  variants: {
    // the slash fades out and strikes across again from the top-left; the shield flinches under it
    revoke: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=slash]",
            { opacity: [1, 0, 0, 1] },
            {
              duration: seconds * 0.35,
              times: [0, 0.4, 0.55, 1],
              ease: "easeOut",
            },
          ),
          animate(
            "[data-part=slash]",
            { pathLength: [1, 1, 0, 1] },
            {
              duration: seconds * 0.7,
              times: [0, 0.2, 0.22, 1],
              ease: "easeOut",
            },
          ),
          animate(
            "[data-part=shield]",
            { scale: [1, 1, 0.9, 1.03, 1] },
            {
              duration: seconds,
              times: [0, 0.45, 0.62, 0.82, 1],
              ease: "easeInOut",
            },
          ),
        ]),
    },
    // the shield shakes its head, side to side, damped
    shake: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate("[data-part=shield]", { x: [0, -1.5, 1.5, -1, 0.5, 0] }, { duration: seconds, ease: "easeInOut" }),
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
