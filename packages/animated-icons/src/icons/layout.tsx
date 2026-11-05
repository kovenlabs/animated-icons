"use client"

import type { Easing } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    layout: "resize" | "stretch"
  }
}

/** The column hangs from the header: 11 long, from the header line (y 9) to the frame (y 20). */
const COLUMN = 11

/** 2 colors: window frame (primary), header and column dividers (accent). */
export const Layout = createAnimatedIcon({
  name: "layout",
  category: "layout",
  keywords: ["panels", "template", "header", "sidebar", "dashboard", "wireframe", "page layout", "panels top left"],
  slots: { primary: "window frame", accent: "header and column dividers" },
  defaultVariant: "resize",
  variants: {
    // the side column is dragged wider under the header, then springs back with a small give
    resize: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=column]",
          { x: [0, 4, -1, 0] },
          { duration: seconds, times: [0, 0.4, 0.75, 1], ease: "easeInOut" },
        ),
    },
    // the header grows taller, pressing the column down with it, then settles back
    stretch: {
      duration: 850,
      run: ({ animate, seconds }) => {
        const options = { duration: seconds, times: [0, 0.4, 0.75, 1], ease: ["easeInOut", ease.out, "easeOut"] satisfies Easing[] }
        // the column's top stays on the header line: its length shrinks by exactly the header's drop
        const drop = [0, 3, -0.5, 0]
        return Promise.all([
          animate("[data-part=header]", { y: drop }, options),
          animate("[data-part=column]", { scaleY: drop.map((d) => (COLUMN - d) / COLUMN) }, options),
        ])
      },
    },
  },
  render: () => (
    <>
      <rect x="3" y="3" width="18" height="18" />
      <g stroke={slot.accent}>
        <path data-part="header" d="M4 9h16" />
        <path data-part="column" d={`M9 9v${COLUMN}`} style={pivot("50% 100%")} />
      </g>
    </>
  ),
})
