"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "folder-kanban": "sort" | "hop"
  }
}

/** Three columns hanging from one line, 5 apart: todo, doing (the short one), done. */
const COLUMNS = ["M7 10v4", "M12 10v2", "M17 10v6"] as const

/** 2 colors: folder (primary), board columns (accent). */
export const FolderKanban = createAnimatedIcon({
  name: "folder-kanban",
  family: "folder",
  category: "files",
  keywords: ["project", "projects", "board", "tasks", "workflow", "kanban", "planning", "workspace"],
  slots: { primary: "folder", accent: "board columns" },
  defaultVariant: "sort",
  variants: {
    // the columns pull up and spring back down one after another, like a board being re-sorted
    sort: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part^=column]",
          { scaleY: [1, 0.3, 1.1, 0.97, 1] },
          {
            duration: seconds * 0.7,
            times: [0, 0.3, 0.65, 0.85, 1],
            ease: "easeInOut",
            delay: stagger(seconds * 0.15),
          },
        ),
    },
    // the whole folder hops, board and all, and lands with a small squash
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
      {/* the folder icon's back panel and tab; no front flap, so the body is free for the board */}
      <path d="M2 20V3h7l2 3h11v14z" />
      {/* each column hangs 2 below the tab line and stays 2 clear of the floor, even at its overshoot */}
      <g stroke={slot.accent}>
        {COLUMNS.map((d, i) => (
          <path key={d} data-part={`column-${i}`} d={d} style={pivot("50% 0%")} />
        ))}
      </g>
    </g>
  ),
})
