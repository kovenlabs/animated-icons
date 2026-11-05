"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "folder-tree": "branch" | "expand"
  }
}

/** 2 colors: folders (primary), tree lines (accent). */
export const FolderTree = createAnimatedIcon({
  name: "folder-tree",
  family: "folder",
  category: "files",
  keywords: ["directory tree", "file tree", "hierarchy", "structure", "subfolders", "nested", "explorer"],
  slots: { primary: "folders", accent: "tree lines" },
  defaultVariant: "branch",
  variants: {
    // the tree fades and grows again: the trunk draws down to the lower folder, and the upper
    // branch draws out as the trunk passes it (each hidden while too short to read)
    branch: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=trunk]",
            { opacity: [1, 0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.15, 0.25, 0.26, 1] },
          ),
          animate(
            "[data-part=trunk]",
            { pathLength: [1, 1, 0, 1, 1] },
            { duration: seconds, times: [0, 0.24, 0.25, 0.85, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=branch]",
            { opacity: [1, 0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.15, 0.4, 0.41, 1] },
          ),
          animate(
            "[data-part=branch]",
            { pathLength: [1, 1, 0, 1, 1] },
            { duration: seconds, times: [0, 0.39, 0.4, 0.65, 1], ease: "easeOut" },
          ),
        ]),
    },
    // the folders slide out along their branches one after the other, then settle back
    expand: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part^=node]",
          { x: [0, 1.5, 1.5, 0] },
          { duration: seconds * 0.8, times: [0, 0.35, 0.55, 1], ease: "easeInOut", delay: stagger(seconds * 0.2) },
        ),
    },
  },
  render: () => (
    <>
      {/* two small folders, each the folder's back panel and tab at a smaller size */}
      <path data-part="node-0" d="M12 10V3h3l1 2h5v5z" />
      <path data-part="node-1" d="M12 21v-7h3l1 2h5v5z" />
      {/* the tree: a trunk that turns into the lower folder, and a branch to the upper one; both
          stop 4 short of their folder */}
      <g stroke={slot.accent}>
        <path data-part="trunk" d="M3 3v15h5" />
        <path data-part="branch" d="M3 7h5" />
      </g>
    </>
  ),
})
