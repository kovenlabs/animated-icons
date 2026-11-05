"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "file-question": "ask" | "pop" | "lift"
  }
}

/** 2 colors: page (primary), question mark (accent). */
export const FileQuestion = createAnimatedIcon({
  name: "file-question",
  family: "file",
  category: "files",
  keywords: ["unknown file", "unknown type", "missing file", "help", "question", "unsupported", "document"],
  slots: { primary: "page", accent: "question mark" },
  defaultVariant: "ask",
  variants: {
    // the question mark tips one way and the other on its dot, puzzled, then stands straight
    ask: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=mark]",
          { rotate: [0, -12, 10, -4, 0] },
          { duration: seconds, times: [0, 0.25, 0.55, 0.8, 1], ease: "easeInOut" },
        ),
    },
    // the question mark swells and settles
    pop: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate("[data-part=mark]", { scale: [1, 1.18, 1] }, { duration: seconds, ease: ease.out }),
    },
    // the page lifts off the desk, mark and all, and settles back with a little squash
    lift: {
      duration: 650,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=file]",
          { y: [0, -2, 0, 0], scaleY: [1, 1, 0.95, 1] },
          { duration: seconds, times: [0, 0.4, 0.7, 1], ease: "easeOut" },
        ),
    },
  },
  render: () => (
    // the page spans x 4..18: shifted 1 right so the family sits centred in the 24 grid
    <g transform="translate(1 0)">
      <g data-part="file" style={pivot("50% 100%")}>
        {/* the file page and its folded corner, as in `file` */}
        <path d="M18 7v15H4V2h9z" />
        <path d="M13 2v5h5" />
        {/* a squared question mark on the page's centre line: a hook under the fold, a short stem,
            then a 2×2 dot 2 below it. It rocks on its dot */}
        <g data-part="mark" stroke={slot.accent} style={pivot("50% 100%")}>
          <path d="M8 12v-2h6v4h-3v1" />
          <rect x="10" y="18" width="2" height="2" fill={slot.accent} stroke="none" />
        </g>
      </g>
    </g>
  ),
})
