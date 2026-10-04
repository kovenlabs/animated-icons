"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    folder: "open" | "peek"
  }
}

/** 2 colors: folder (primary), sheet (accent). */
export const Folder = createAnimatedIcon({
  name: "folder",
  category: "files",
  keywords: ["directory", "files", "documents", "archive", "project", "storage"],
  slots: { primary: "folder", accent: "sheet" },
  defaultVariant: "open",
  variants: {
    // the front flap drops open and the sheet lifts a little inside. Only the flap's top edge moves:
    // the back panel already draws the sides, so no stroke gets squashed
    open: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=front]",
            { y: [0, 2, 2, 0] },
            { duration: seconds, times: [0, 0.35, 0.65, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=sheet]",
            { scaleY: [1, 1.25, 1.25, 1] },
            { duration: seconds, times: [0, 0.4, 0.65, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the sheet slides up past the back edge, then tucks back in
    peek: {
      duration: 850,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=sheet]",
          { scaleY: [1, 1.8, 1.8, 1] },
          { duration: seconds, times: [0, 0.35, 0.6, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <>
      {/* back panel with its tab; the front panel draws the bottom edge */}
      <path d="M2 20V3h7l2 3h11v14z" />
      {/* the sheet's foot hides under the front panel's top stroke */}
      <rect data-part="sheet" x="6" y="10" width="12" height="5" fill={slot.accent} stroke="none" style={pivot("50% 100%")} />
      <path data-part="front" d="M2 14h20" />
    </>
  ),
})
