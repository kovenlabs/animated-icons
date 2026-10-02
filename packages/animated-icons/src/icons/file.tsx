"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    file: "fold" | "lift"
  }
}

/** 2 colors: page (primary), folded corner (accent). */
export const FileIcon = createAnimatedIcon({
  name: "file",
  category: "files",
  keywords: ["document", "page", "paper", "blank file", "new file", "sheet"],
  slots: { primary: "page", accent: "folded corner" },
  defaultVariant: "fold",
  variants: {
    // the dog-ear flips up over its crease into the open corner, then folds back down
    fold: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=fold]",
          { scaleY: [1, -1, -1, 1] },
          { duration: seconds, times: [0, 0.4, 0.55, 1], ease: "easeInOut" },
        ),
    },
    // the page lifts off the desk and settles back with a little squash
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
        {/* The crease (13 2 → 18 7) is laid flat by the outer turn, so the flip is a plain scaleY about it.
            An unpainted mirror of the fold keeps the crease at the centre of the part's box however the
            browser measures a turned child. Drawn first, so the page's edges cover the fold's ends */}
        <g transform="rotate(45 15.5 4.5)">
          <g data-part="fold" style={pivot("50% 50%")}>
            <g transform="rotate(-45 15.5 4.5)">
              <path d="M13 2v5h5" stroke={slot.accent} />
              <path d="M13 2h5v5" stroke="none" />
            </g>
          </g>
        </g>
        {/* the same page as file-search, closed: its corner is cut on the diagonal for the fold */}
        <path d="M18 7v15H4V2h9z" />
      </g>
    </g>
  ),
})
