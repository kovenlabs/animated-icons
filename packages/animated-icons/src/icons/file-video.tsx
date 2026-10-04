"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "file-video": "play" | "pulse" | "lift"
  }
}

/** 2 colors: page (primary), play triangle (accent). */
export const FileVideo = createAnimatedIcon({
  name: "file-video",
  family: "file",
  category: "files",
  keywords: ["video file", "movie", "clip", "recording", "mp4", "media file", "lesson video"],
  slots: { primary: "page", accent: "play triangle" },
  defaultVariant: "play",
  variants: {
    // the play button is pressed: it dips, then springs back
    play: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=play]",
          { scale: [1, 0.6, 1.15, 1] },
          { duration: seconds, times: [0, 0.3, 0.65, 1], ease: ease.out },
        ),
    },
    // the triangle beats twice, like a video starting to buffer
    pulse: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=play]",
          { scale: [1, 1.2, 1, 1.2, 1], opacity: [1, 0.5, 1, 0.5, 1] },
          { duration: seconds, ease: "easeInOut" },
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
        {/* the file page, as in `file` */}
        <path d="M18 7v15H4V2h9z" />
        <path d="M13 2v5h5" />
        {/* a solid play triangle under the fold, 2 clear of the page's right and bottom edges (as big as
            fits, so its point still reads once bevel cuts the corners); it scales about its centroid */}
        <path data-part="play" d="M8 10v9l7-4.5z" fill={slot.accent} stroke="none" style={pivot("33.33% 50%")} />
      </g>
    </g>
  ),
})
