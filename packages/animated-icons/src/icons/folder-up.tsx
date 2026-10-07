"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "folder-up": "lift" | "draw" | "hop"
  }
}

/** 2 colors: folder (primary), arrow (accent). */
export const FolderUp = createAnimatedIcon({
  name: "folder-up",
  family: "folder",
  category: "files",
  keywords: ["upload folder", "choose folder", "directory", "upload", "import", "send"],
  slots: { primary: "folder", accent: "arrow" },
  defaultVariant: "lift",
  variants: {
    // an upward nudge that settles with a small bounce; the point stays under the folder's top edge
    lift: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=arrow]",
          { y: [0, -1.5, 0.5, 0] },
          { duration: seconds, times: [0, 0.4, 0.75, 1], ease: "easeInOut" },
        ),
    },
    // the arrow sinks into its tail and grows back up, head and shaft as one piece
    // (hidden at zero, so the square cap never leaves a stray dot)
    draw: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=arrow]",
          { scaleY: [1, 0, 1], opacity: [1, 0, 1] },
          { duration: seconds, times: [0, 0.4, 1], ease: "easeInOut" },
        ),
    },
    // the whole folder hops, arrow and all, and lands with a small squash
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
      {/* the folder icon's back panel and tab; no front flap, so the body is free for the arrow */}
      <path d="M2 20V3h7l2 3h11v14z" />
      {/* centred low in the body, 2px clear of the floor; it grows from its tail */}
      <g data-part="arrow" stroke={slot.accent} style={pivot("50% 100%")}>
        <path d="M12 16v-6" />
        <path d="M9 13l3-3 3 3" />
      </g>
    </g>
  ),
})
