"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "folder-plus": "add" | "turn" | "hop"
  }
}

/** The badge plus (6 wide), centred low in the body. Local: `badgeGlyph.plus` types its centre as the badge's literal 18, 6. */
const PLUS = "M12 10v6M9 13h6"

/** 2 colors: folder (primary), plus (accent). */
export const FolderPlusIcon = createAnimatedIcon({
  name: "folder-plus",
  family: "folder",
  category: "files",
  keywords: ["new folder", "add folder", "create directory", "directory", "add", "new"],
  slots: { primary: "folder", accent: "plus" },
  defaultVariant: "add",
  variants: {
    // the plus spins in from nothing and lands square; even at its overshoot it stays clear of the walls
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
          { rotate: [-90, 0], scale: [1, 1.1, 1] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    // the whole folder hops, plus and all, and lands with a small squash
    hop: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=folder]",
          { y: [0, -2.5, 0, 0], scaleY: [1, 1.03, 0.96, 1] },
          { duration: seconds, times: [0, 0.4, 0.7, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <g data-part="folder" style={pivot("50% 100%")}>
      {/* the folder icon's back panel and tab; no front flap, so the body is free for the plus */}
      <path d="M2 20V3h7l2 3h11v14z" />
      {/* centred low in the body: 2px clear of every wall, even turned 45° */}
      <path data-part="plus" d={PLUS} stroke={slot.accent} style={pivot("50% 50%")} />
    </g>
  ),
})
