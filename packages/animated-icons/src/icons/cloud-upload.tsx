"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "cloud-upload": "lift" | "upload" | "draw"
  }
}

/** 2 colors: cloud (primary), arrow (accent). */
export const CloudUpload = createAnimatedIcon({
  name: "cloud-upload",
  family: "cloud",
  category: "actions",
  keywords: ["upload", "cloud", "sync", "backup", "send", "arrow up", "store online"],
  slots: { primary: "cloud", accent: "arrow" },
  defaultVariant: "lift",
  variants: {
    // an upward nudge that settles with a small bounce; the point stays well under the cloud's roof
    lift: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=arrow]",
          { y: [0, -2.5, 0.5, 0] },
          { duration: seconds, times: [0, 0.4, 0.75, 1], ease: "easeInOut" },
        ),
    },
    // the arrow rises into the cloud and fades before it reaches the roof, then comes back up from
    // below the frame through the open bottom
    upload: {
      clip: true,
      duration: 850,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=arrow]",
            { y: [0, -3, 7, 0], opacity: [1, 0, 0, 1] },
            { duration: seconds, times: [0, 0.4, 0.55, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=cloud]",
            { y: [0, -1, 0, 0] },
            { duration: seconds, times: [0, 0.35, 0.6, 1], ease: "easeOut" },
          ),
        ]),
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
  },
  render: () => (
    <>
      {/* a faceted cloud: two low shoulders either side of a tall middle lobe; the bottom stays open for the shaft */}
      <path data-part="cloud" d="M5 18l-3-3v-2l3-3h1l2-4 3-2h2l3 2 2 4h1l3 3v2l-3 3" />
      <g data-part="arrow" stroke={slot.accent} style={pivot("50% 100%")}>
        <path d="M12 11v10" />
        <path d="M9 14l3-3 3 3" />
      </g>
    </>
  ),
})
