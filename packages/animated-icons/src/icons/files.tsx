"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    files: "shuffle" | "fold" | "lift"
  }
}

/** 2 colors: pages (primary), front page's folded corner (accent). */
export const Files = createAnimatedIcon({
  name: "files",
  family: "file",
  category: "files",
  keywords: ["documents", "copies", "duplicate", "pages", "multiple files", "stack", "library"],
  slots: { primary: "pages", accent: "folded corner" },
  defaultVariant: "shuffle",
  variants: {
    // the two pages slide a little apart, front up and right, back down and left, then restack
    shuffle: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=front]",
            { x: [0, 1, 1, 0], y: [0, -1.5, -1.5, 0] },
            { duration: seconds, times: [0, 0.35, 0.6, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=back]",
            { x: [0, -1, -1, 0], y: [0, 1, 1, 0] },
            { duration: seconds, times: [0, 0.35, 0.6, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the front page's dog-ear flips up over its crease into the open corner, then folds back down
    fold: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=fold]",
          { scaleY: [1, -1, -1, 1] },
          { duration: seconds, times: [0, 0.4, 0.55, 1], ease: "easeInOut" },
        ),
    },
    // the stack lifts off the desk and settles back with a little squash
    lift: {
      duration: 650,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=files]",
          { y: [0, -2, 0, 0], scaleY: [1, 1, 0.95, 1] },
          { duration: seconds, times: [0, 0.4, 0.7, 1], ease: "easeOut" },
        ),
    },
  },
  render: () => (
    <g data-part="files" style={pivot("50% 100%")}>
      {/* the back page peeks out below and left of the front one: only its top-left corner and its
          bottom show, each edge stopping 2+ clear of the front page */}
      <path data-part="back" d="M6 7H3v15h11v-3" style={pivot("50% 50%")} />
      <g data-part="front" style={pivot("50% 50%")}>
        {/* the file family's dog-ear, flipped about its crease (16 2 → 21 7) exactly as in `file` */}
        <g transform="rotate(45 18.5 4.5)">
          <g data-part="fold" style={pivot("50% 50%")}>
            <g transform="rotate(-45 18.5 4.5)">
              <path d="M16 2v5h5" stroke={slot.accent} />
              <path d="M16 2h5v5" stroke="none" />
            </g>
          </g>
        </g>
        {/* the front page, 12 × 15, its corner cut on the diagonal for the fold */}
        <path d="M21 7v10H9V2h7z" />
      </g>
    </g>
  ),
})
