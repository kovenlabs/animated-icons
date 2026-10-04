"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "file-archive": "zip" | "tug"
  }
}

/** Zipper teeth: 2×2 squares alternating either side of x 8.5, down from under the page's top edge. */
const TEETH = [
  { x: 8.5, y: 5 },
  { x: 6.5, y: 7 },
  { x: 8.5, y: 9 },
] as const

/** 2 colors: page (primary), zipper + clasp (accent). */
export const FileArchive = createAnimatedIcon({
  name: "file-archive",
  family: "file",
  category: "files",
  keywords: ["zip", "archive", "compressed file", "rar", "bundle", "backup", "package"],
  slots: { primary: "page", accent: "zipper + clasp" },
  defaultVariant: "zip",
  variants: {
    // the teeth fade away and close back up one after another, top to bottom, like a zip running down
    zip: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=tooth]",
            { opacity: [1, 0, 0, 1], scale: [1, 0.4, 0.4, 1] },
            { duration: seconds * 0.6, times: [0, 0.3, 0.5, 1], delay: stagger(seconds * 0.12), ease: "easeOut" },
          ),
          animate(
            "[data-part=clasp]",
            { y: [0, 0, 1, 0] },
            { duration: seconds, times: [0, 0.6, 0.8, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the clasp is tugged down twice and springs back up
    tug: {
      duration: 700,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=clasp]",
          { y: [0, 1, 0, 1, 0], scaleY: [1, 1.1, 1, 1.1, 1] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    // the page spans x 4..18: shifted 1 right so the family sits centred in the 24 grid
    <g transform="translate(1 0)">
      <>
        {/* the file page, as in `file` */}
        <path d="M18 7v15H4V2h9z" />
        <path d="M13 2v5h5" />
        <g fill={slot.accent} stroke="none">
          {TEETH.map(({ x, y }) => (
            <rect key={y} data-part="tooth" x={x} y={y} width="2" height="2" style={pivot("50% 50%")} />
          ))}
        </g>
        {/* the clasp hangs 2 below the last tooth and 2 above the page's bottom edge */}
        <path data-part="clasp" d="M6.5 14h4v4h-4z" stroke={slot.accent} style={pivot("50% 0%")} />
      </>
    </g>
  ),
})
