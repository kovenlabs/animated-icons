"use client"

import { useId } from "react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"
import { useShapedDrawing } from "../lib/shape"

declare module "../lib/types" {
  interface IconVariants {
    album: "slide" | "flip" | "wobble"
  }
}

/** The record, a true circle (it is round), half out of its sleeve. */
const DISC = { cx: 15, cy: 12, r: 6 }

/**
 * The record sits in front of the sleeve. A mask hides the sleeve within 2 of the record's stroke,
 * and its hole is tagged as part of the record, so it moves with it and the record always occludes
 * the sleeve instead of crossing its stroke.
 */
function Drawing() {
  const mask = `album-${useId().replace(/[^\w-]/g, "")}`
  // drawn in its own component (for the mask id), so it shapes its corners from context
  return useShapedDrawing(
    <g data-part="album" style={pivot("50% 50%")}>
      <mask id={mask}>
        <rect x="0" y="0" width="24" height="24" fill="white" stroke="none" />
        <circle data-part="disc" cx={DISC.cx} cy={DISC.cy} r={DISC.r + 3} fill="black" stroke="none" style={pivot("50% 50%")} />
      </mask>
      <path d="M2 5h14v14H2Z" mask={`url(#${mask})`} />
      <g data-part="disc" style={pivot("50% 50%")}>
        <circle {...DISC} stroke={slot.accent} />
        <circle cx={DISC.cx} cy={DISC.cy} r="1.5" fill={slot.accent} stroke="none" />
      </g>
    </g>,
  )
}

/** 2 colors: sleeve (primary), record (accent). */
export const Album = createAnimatedIcon({
  name: "album",
  category: "media",
  keywords: ["record", "vinyl", "music", "lp", "release", "sleeve", "discography"],
  slots: { primary: "sleeve", accent: "record" },
  defaultVariant: "slide",
  variants: {
    // the record slides back into the sleeve, shrinking and fading as it sinks behind it, then shoots
    // out past its spot and the album kicks
    slide: {
      clip: false,
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=disc]",
            { x: [0, -6, -6, 0.8, 0], scale: [1, 0.8, 0.8, 1.05, 1], opacity: [1, 0.35, 0.35, 1, 1] },
            { duration: seconds, times: [0, 0.3, 0.45, 0.75, 1], ease: [ease.inOut, "linear", ease.out, "easeInOut"] },
          ),
          animate(
            "[data-part=album]",
            { rotate: [0, 0, 0, -7, 3, 0] },
            { duration: seconds, times: [0, 0.45, 0.55, 0.72, 0.87, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the album turns over on its spine like a card in 3D, leaning into the turn and hopping, and
    // lands face-on with a bounce
    flip: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=album]",
          {
            scaleX: [1, 0, -1, -1, 0, 1],
            skewY: [0, 12, 0, 0, -12, 0],
            y: [0, -2.5, -1, -1, -2.5, 0],
          },
          {
            duration: seconds,
            times: [0, 0.2, 0.4, 0.6, 0.8, 1],
            ease: ["easeIn", "easeOut", "linear", "easeIn", ease.overshoot],
          },
        ),
    },
    // the record tips on its spindle like a coin settling on a table, wobbling flatter and faster
    // until it lies still
    wobble: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=disc]",
          {
            scaleY: [1, 0.35, 1, 0.55, 1, 0.8, 1],
            skewX: [0, 18, 0, -12, 0, 6, 0],
            y: [0, 1.5, 0, 1, 0, 0.5, 0],
          },
          { duration: seconds, times: [0, 0.18, 0.36, 0.52, 0.68, 0.84, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => <Drawing />,
})
