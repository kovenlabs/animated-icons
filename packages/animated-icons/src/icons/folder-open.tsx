"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "folder-open": "flap" | "hop"
  }
}

/** Skew that stands the front flap upright: its slanted right edge (4 across over 10 down) turns vertical. */
const UPRIGHT = (Math.atan(4 / 10) * 180) / Math.PI

/** 2 colors: folder (primary), front flap (accent). */
export const FolderOpen = createAnimatedIcon({
  name: "folder-open",
  family: "folder",
  category: "files",
  keywords: ["open folder", "directory", "browse", "explore", "files", "documents", "project"],
  slots: { primary: "folder", accent: "front flap" },
  defaultVariant: "flap",
  variants: {
    // the front flap swings up to close the folder, holds, and falls open again; it shears about its
    // bottom edge, so the bottom never moves and no horizontal stroke gets squashed
    flap: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=front]",
          { skewX: [0, UPRIGHT, UPRIGHT, 0] },
          { duration: seconds, times: [0, 0.35, 0.6, 1], ease: "easeInOut" },
        ),
    },
    // the whole folder hops and lands with a small squash
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
      {/* the folder icon's back panel and tab, cut off where the open flap's top edge crosses it */}
      <path d="M20 10V6h-9L9 3H2v17h16" />
      {/* the flap tips forward: its short left edge floats 4 clear of the back wall, its foot is the folder's corner */}
      <path data-part="front" d="M6 14l2-4h14l-4 10" stroke={slot.accent} style={pivot("50% 100%")} />
    </g>
  ),
})
