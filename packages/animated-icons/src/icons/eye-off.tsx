"use client"

import { useId } from "react"

import { createAnimatedIcon } from "../lib/create-icon"
import { useShapedDrawing } from "../lib/shape"
import { ease, pivot, slot } from "../lib/motion"
import { SLASH } from "../lib/parts"

declare module "../lib/types" {
  interface IconVariants {
    "eye-off": "hide" | "blink" | "pop"
  }
}

/**
 * The `eye`'s almond, cut 2px clear of the slash: a 6px band along the slash masks it out. The pupil is
 * left out, since the band would cut it away whole. The band is a `slash` part too, so it draws on, pops
 * and fades with the slash, and the eye only ever moves behind it.
 */
function Drawing() {
  const mask = `eye-off-${useId().replace(/[^\w-]/g, "")}`
  // drawn in its own component (for the mask id), so it shapes its corners from context
  return useShapedDrawing(
    <>
      <mask id={mask} maskUnits="userSpaceOnUse" x="-4" y="-4" width="32" height="32">
        <rect x="-4" y="-4" width="32" height="32" fill="#fff" stroke="none" />
        <path data-part="slash" d={SLASH} stroke="#000" strokeWidth={6} style={pivot("50% 50%")} />
      </mask>
      <g mask={`url(#${mask})`}>
        {/* the eye's almond from straight segments: pointed corners, flat lids */}
        <path data-part="eye" d="M2 12l6-5h8l6 5-6 5H8z" style={pivot("50% 50%")} />
      </g>
      <path data-part="slash" d={SLASH} stroke={slot.accent} style={pivot("50% 50%")} />
    </>
  )
}

/** 2 colors: outline (primary), slash (accent). */
export const EyeOff = createAnimatedIcon({
  name: "eye-off",
  family: "eye",
  category: "security",
  keywords: ["hide", "hidden", "invisible", "conceal", "private", "password", "visibility off"],
  slots: { primary: "outline", accent: "slash" },
  defaultVariant: "hide",
  variants: {
    // the slash fades out and strikes across again from the top-left; the eye squints shut under it
    hide: {
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
            "[data-part=eye]",
            { scaleY: [1, 1, 0.4, 1] },
            { duration: seconds, times: [0, 0.4, 0.65, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the lids close to a slit behind the slash and reopen
    blink: {
      duration: 450,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=eye]",
          { scaleY: [1, 0.12, 1] },
          { duration: seconds, times: [0, 0.4, 1], ease: "easeInOut" },
        ),
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
