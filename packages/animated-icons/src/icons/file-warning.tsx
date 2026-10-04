"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "file-warning": "alert" | "shake" | "blink"
  }
}

/** 2 colors: page (primary), exclamation mark (accent). */
export const FileWarning = createAnimatedIcon({
  name: "file-warning",
  family: "file",
  category: "files",
  keywords: ["file error", "warning", "corrupt file", "invalid document", "alert", "problem", "attention"],
  slots: { primary: "page", accent: "exclamation mark" },
  defaultVariant: "alert",
  variants: {
    // the exclamation mark jumps up and lands back with a little stretch, calling for attention
    alert: {
      duration: 650,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=mark]",
          { y: [0, -2, 0, 0], scaleY: [1, 1.1, 0.92, 1] },
          { duration: seconds, times: [0, 0.4, 0.7, 1], ease: ease.out },
        ),
    },
    // the whole page shudders side to side, like a rejected upload
    shake: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=file]",
          { x: [0, -1.5, 1.5, -1, 1, 0], rotate: [0, -3, 3, -2, 1, 0] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    // the exclamation mark blinks twice, like a warning light
    blink: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=mark]",
          { opacity: [1, 0, 1, 0, 1] },
          { duration: seconds, times: [0, 0.2, 0.45, 0.65, 0.9], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    // the page spans x 4..18: shifted 1 right so the family sits centred in the 24 grid
    <g transform="translate(1 0)">
      <g data-part="file" style={pivot("50% 100%")}>
        {/* the file page, as in `file` */}
        <path d="M18 7v15H4V2h9z" />
        <path d="M13 2v5h5" />
        {/* the mark sits on the page's centre line, its bar clear of the fold's corner */}
        <g data-part="mark" style={pivot("50% 100%")}>
          <path d="M11 10v4" stroke={slot.accent} />
          <rect x="10" y="17" width="2" height="2" fill={slot.accent} stroke="none" />
        </g>
      </g>
    </g>
  ),
})
