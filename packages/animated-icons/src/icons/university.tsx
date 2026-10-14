"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    university: "toss" | "rise" | "open"
  }
}

/** A mortarboard seen from the side: a flat diamond centred on (cx, 6), waiting either side of the dome. */
const cap = (cx: number) => `M${cx - 2.5} 6l2.5-1.25 2.5 1.25-2.5 1.25z`

/** The two caps, left and right, and which way each is thrown. */
const CAPS = [
  { cx: 5, dir: -1 },
  { cx: 19, dir: 1 },
] as const

/** 2 colors: hall (primary), finial, door and caps (accent). */
export const University = createAnimatedIcon({
  name: "university",
  category: "buildings",
  keywords: ["college", "campus", "academy", "graduation", "faculty", "higher education", "institute", "alumni"],
  slots: { primary: "hall", accent: "finial + door + caps" },
  defaultVariant: "toss",
  variants: {
    // graduation: the hall crouches and two caps fly up out of the frame, spinning, and drop back out of sight
    toss: {
      clip: true,
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=university]",
            { scaleY: [1, 0.94, 1.02, 1, 1] },
            { duration: seconds, times: [0, 0.12, 0.28, 0.45, 1], ease: "easeInOut" },
          ),
          ...CAPS.map(({ dir }, i) =>
            animate(
              `[data-part=cap]:nth-of-type(${i + 1})`,
              { opacity: [0, 1, 1, 0], y: [1, -8, -3, 2], x: [0, dir * 1.5, dir * 2.5, dir * 3], rotate: [0, dir * 200, dir * 300, dir * 360] },
              {
                duration: seconds * 0.85,
                delay: seconds * (0.12 + i * 0.05),
                times: [0, 0.45, 0.8, 1],
                ease: ["easeOut", "easeIn", "easeIn"],
              },
            ),
          ),
        ]),
    },
    // the dome squashes onto the roof and springs up tall, like a jelly, before it settles
    rise: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=dome]",
          { scaleY: [1, 0.75, 1.12, 0.95, 1], scaleX: [1, 1.12, 0.92, 1.03, 1] },
          { duration: seconds, times: [0, 0.2, 0.45, 0.7, 1], ease: "easeInOut" },
        ),
    },
    // the great door swings out toward you on its hinge, holds open, and closes
    open: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=door]",
          { scaleX: [1, 0.2, 0.2, 1], skewY: [0, -16, -16, 0] },
          { duration: seconds, times: [0, 0.3, 0.7, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <>
      <g fill={slot.accent} stroke="none">
        {CAPS.map(({ cx }) => (
          <path key={cx} data-part="cap" d={cap(cx)} style={flash()} />
        ))}
      </g>
      <g data-part="university" style={pivot("50% 100%")}>
        <path d="M2 22h20" />
        {/* one long hall, two tall windows either side of a wide door */}
        <path d="M3 22V10h18v12" />
        <path d="M7 14v4M17 14v4" />
        <path data-part="door" d="M10 22v-5h4v5z" fill={slot.accent} stroke="none" style={pivot("0% 100%")} />
        {/* a true half-circle dome on the roof line, the finial rising from its crown */}
        <g data-part="dome" style={pivot("50% 100%")}>
          <path d="M8 10a4 4 0 0 1 8 0" />
          <path d="M12 6V3" stroke={slot.accent} />
        </g>
      </g>
    </>
  ),
})
