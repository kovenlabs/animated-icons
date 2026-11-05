"use client"

import { useId } from "react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"
import { SLASH } from "../lib/parts"
import { useShapedDrawing } from "../lib/shape"

declare module "../lib/types" {
  interface IconVariants {
    "image-off": "break" | "fade" | "pop"
  }
}

/**
 * The `image` scene split by the slash: one 45° peak in the bottom-left half, standing on the frame's
 * floor, and the sun in the top-right half, each kept more than 2px clear of the slash's band.
 */
const PEAK = "M3 17l4-4 8 8"

/**
 * The `image` frame, cut 2px clear of the slash: a 6px band along the slash masks it out. The band is a
 * `slash` part too, so it draws on, pops and fades with the slash, and the picture only ever moves
 * behind it.
 */
function Drawing() {
  const mask = `image-off-${useId().replace(/[^\w-]/g, "")}`
  // drawn in its own component (for the mask id), so it shapes its corners from context
  return useShapedDrawing(
    <>
      <mask id={mask} maskUnits="userSpaceOnUse" x="-4" y="-4" width="32" height="32">
        <rect x="-4" y="-4" width="32" height="32" fill="#fff" stroke="none" />
        <path data-part="slash" d={SLASH} stroke="#000" strokeWidth={6} style={pivot("50% 50%")} />
      </mask>
      <g mask={`url(#${mask})`}>
        <g data-part="picture" style={pivot("50% 50%")}>
          <rect x="3" y="3" width="18" height="18" />
          <g data-part="scene">
            <path d={PEAK} stroke={slot.secondary} />
            {/* the sun is round, so it gets a true circle */}
            <circle cx="16" cy="8" r="2" fill={slot.secondary} stroke="none" />
          </g>
        </g>
      </g>
      <path data-part="slash" d={SLASH} stroke={slot.accent} style={pivot("50% 50%")} />
    </>,
  )
}

/** 3 colors: frame (primary), mountain and sun (secondary), slash (accent). */
export const ImageOff = createAnimatedIcon({
  name: "image-off",
  family: "image",
  category: "media",
  keywords: ["broken image", "image failed", "no image", "missing picture", "photo off", "hide image", "no preview"],
  slots: { primary: "frame", secondary: "mountain + sun", accent: "slash" },
  defaultVariant: "break",
  variants: {
    // the slash fades out and strikes across again from the top-left; the picture flinches under it
    break: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=slash]", { opacity: [1, 0, 0, 1] }, { duration: seconds * 0.35, times: [0, 0.4, 0.55, 1], ease: "easeOut" }),
          animate("[data-part=slash]", { pathLength: [1, 1, 0, 1] }, { duration: seconds * 0.7, times: [0, 0.2, 0.22, 1], ease: "easeOut" }),
          animate(
            "[data-part=picture]",
            { scale: [1, 1, 0.92, 1.02, 1] },
            { duration: seconds, times: [0, 0.45, 0.62, 0.82, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the picture tries to load: the scene fades out and back twice, then holds
    fade: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=scene]",
          { opacity: [1, 0.2, 1, 0.2, 1] },
          { duration: seconds, times: [0, 0.25, 0.5, 0.75, 1], ease: "easeInOut" },
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
