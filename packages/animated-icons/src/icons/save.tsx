"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    save: "press" | "shutter"
  }
}

/** 2 colors: disk and label (primary), shutter (accent). */
export const Save = createAnimatedIcon({
  name: "save",
  category: "files",
  keywords: ["floppy disk", "store", "keep", "save changes", "persist", "write", "disk"],
  slots: { primary: "disk + label", accent: "shutter" },
  defaultVariant: "press",
  variants: {
    // stamped down like a seal: it lifts, presses flat against its base, and springs back
    press: {
      duration: 650,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=disk]",
          { y: [0, -1.5, 1, 0], scaleY: [1, 1.03, 0.92, 1] },
          { duration: seconds, times: [0, 0.35, 0.65, 1], ease: "easeInOut" },
        ),
    },
    // the metal shutter slides open along the top edge and snaps shut again
    shutter: {
      duration: 750,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=shutter]",
          { x: [0, 3, 3, 0] },
          { duration: seconds, times: [0, 0.35, 0.6, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <g data-part="disk" style={pivot("50% 100%")}>
      {/* a square disk with its top-right corner clipped off */}
      <path d="M3 3h13l5 5v13H3z" />
      {/* the label hangs from the bottom edge */}
      <path d="M7 21v-8h10v8" />
      {/* the shutter rides the top edge; it stops 2px short of the clipped corner even fully open */}
      <path data-part="shutter" d="M7 3v5h7" stroke={slot.accent} />
    </g>
  ),
})
