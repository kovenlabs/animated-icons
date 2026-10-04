"use client"

import { useId } from "react"

import { createAnimatedIcon } from "../lib/create-icon"
import { useShapedDrawing } from "../lib/shape"
import { ease, pivot, slot } from "../lib/motion"
import { SLASH } from "../lib/parts"

declare module "../lib/types" {
  interface IconVariants {
    "pin-off": "unpin" | "wiggle" | "pop"
  }
}

/**
 * The `pin`, cut 2px clear of the slash: a 6px band along the slash masks it out. The band is a `slash`
 * part too, so it draws on, pops and fades with the slash, and the pin only ever moves behind it.
 */
function Drawing() {
  const mask = `pin-off-${useId().replace(/[^\w-]/g, "")}`
  // drawn in its own component (for the mask id), so it shapes its corners from context
  return useShapedDrawing(
    <>
      <mask id={mask} maskUnits="userSpaceOnUse" x="-4" y="-4" width="32" height="32">
        <rect x="-4" y="-4" width="32" height="32" fill="#fff" stroke="none" />
        <path data-part="slash" d={SLASH} stroke="#000" strokeWidth={6} style={pivot("50% 50%")} />
      </mask>
      <g mask={`url(#${mask})`}>
        {/* pivots on the needle tip, like `pin` */}
        <g data-part="pin" style={pivot("50% 100%")}>
          {/* the pin's cap, shaft and collar, all straight segments */}
          <path d="M7 2h10v4h-2v5l4 3v3H5v-3l4-3V6H7Z" />
          <path d="M12 17v5" />
        </g>
      </g>
      <path data-part="slash" d={SLASH} stroke={slot.accent} style={pivot("50% 50%")} />
    </>
  )
}

/** 2 colors: pin (primary), slash (accent). */
export const PinOff = createAnimatedIcon({
  name: "pin-off",
  family: "pin",
  category: "actions",
  keywords: ["unpin", "detach", "remove pin", "unstick", "unpinned", "release"],
  slots: { primary: "pin", accent: "slash" },
  defaultVariant: "unpin",
  variants: {
    // the slash fades out and strikes across again from the top-left; the pin gives one loose wobble under it
    unpin: {
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
            "[data-part=pin]",
            { rotate: [0, 0, -6, 4, -1.5, 0] },
            { duration: seconds, times: [0, 0.45, 0.6, 0.75, 0.88, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // loose in the board, it wobbles on its needle tip behind the slash
    wiggle: {
      duration: 700,
      run: ({ animate, seconds }) =>
        animate("[data-part=pin]", { rotate: [0, -10, 8, -4, 1.5, 0] }, { duration: seconds, ease: "easeInOut" }),
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
