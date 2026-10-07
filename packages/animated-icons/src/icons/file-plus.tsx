"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "file-plus": "add" | "turn" | "lift"
  }
}

/** The plus (6 wide), centred in the page below its fold, before the family's 1px shift right. */
const PLUS = "M11 11v6M8 14h6"

/** 2 colors: page (primary), plus (accent). */
export const FilePlus = createAnimatedIcon({
  name: "file-plus",
  family: "file",
  category: "files",
  keywords: ["new file", "add file", "create document", "new document", "add", "new page", "blank"],
  slots: { primary: "page", accent: "plus" },
  defaultVariant: "add",
  variants: {
    // the plus spins in from nothing and lands square; even at its overshoot it stays clear of the edges
    add: {
      duration: 650,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=plus]",
          { scale: [0, 1.12, 1], rotate: [-90, 0, 0], opacity: [0, 1, 1] },
          { duration: seconds, times: [0, 0.7, 1], ease: ease.overshoot },
        ),
    },
    // a quarter turn in place, with a little swell on the way (a plus looks the same at -90°, so it starts there unseen)
    turn: {
      duration: 700,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=plus]",
          { rotate: [-90, 0], scale: [1, 1.12, 1] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    // the page lifts off the desk, plus and all, and settles back with a little squash
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
        {/* 2px clear of the walls and the fold, even turned 45° */}
        <path data-part="plus" d={PLUS} stroke={slot.accent} style={pivot("50% 50%")} />
      </g>
    </g>
  ),
})
