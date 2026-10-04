"use client"

import { useId } from "react"

import { createAnimatedIcon } from "../lib/create-icon"
import { flash, pivot, slot } from "../lib/motion"
import { useShapedDrawing } from "../lib/shape"

declare module "../lib/types" {
  interface IconVariants {
    mountain: "rise" | "glint"
  }
}

/** A tall peak and a lower one to its right, a valley between, on a flat base. */
const RANGE = "M2 20 9 4l4 8 3-3 6 11z"

/** 3 colors: mountains (primary), snow cap (secondary), sun and glint (accent). */
function Drawing() {
  const behind = `mountain-${useId().replace(/[^\w-]/g, "")}`
  // drawn in its own component (for the mask id), so it shapes its corners from context
  return useShapedDrawing(
    <>
      {/* the sun hides behind the range, 1px clear of its outline, so it never crosses a line */}
      <mask id={behind} maskUnits="userSpaceOnUse" x="-4" y="-4" width="32" height="32">
        <rect x="-4" y="-4" width="32" height="32" fill="#fff" stroke="none" />
        <path d={RANGE} fill="#000" stroke="#000" strokeWidth={4} />
      </mask>
      <g mask={`url(#${behind})`}>
        {/* the sun is round, so it gets a true circle */}
        <circle data-part="sun" cx="16.5" cy="4.5" r="2" fill={slot.accent} stroke="none" style={pivot("50% 50%")} />
      </g>
      <path data-part="glint" d="M4.5 3.5l.75 1.75L7 6l-1.75.75L4.5 8.5l-.75-1.75L2 6l1.75-.75z" fill={slot.accent} stroke="none" style={flash()} />
      <path d={RANGE} />
      <path data-part="snow" d="M6.8 9 8.5 10.5 10 9l2 1" stroke={slot.secondary} style={pivot("50% 50%")} />
    </>,
  )
}

export const Mountain = createAnimatedIcon({
  name: "mountain",
  category: "nature",
  keywords: ["peak", "landscape", "hiking", "outdoors", "summit", "alps", "terrain", "travel"],
  slots: { primary: "mountains", secondary: "snow cap", accent: "sun + glint" },
  defaultVariant: "rise",
  variants: {
    // the sun sinks behind the lower peak and rises back over it
    rise: {
      clip: false,
      duration: 1300,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=sun]",
          { y: [0, 9, 9, 0] },
          { duration: seconds, times: [0, 0.35, 0.45, 1], ease: "easeInOut" },
        ),
    },
    // light catches the snow: the cap swells as a glint flares by the summit, turning as it fades
    glint: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=glint]",
            { opacity: [0, 1, 1, 0], scale: [0.4, 1.2, 1, 0.6], rotate: [0, 45, 60, 90] },
            { duration: seconds, times: [0, 0.35, 0.6, 1], ease: "easeOut" },
          ),
          animate("[data-part=snow]", { scale: [1, 1.2, 1] }, { duration: seconds * 0.6, ease: "easeInOut" }),
        ]),
    },
  },
  render: () => <Drawing />,
})
