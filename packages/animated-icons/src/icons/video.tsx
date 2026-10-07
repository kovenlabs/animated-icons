"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    video: "record" | "zoom" | "nudge"
  }
}

/** The camera body and its lens hood; `video-off` draws the same two. */
const BODY = "M2 6h14v12H2z"
const LENS = "M16 10l6-3v10l-6-3"

/** 2 colors: camera (primary), record light (accent). */
export const Video = createAnimatedIcon({
  name: "video",
  category: "media",
  keywords: ["video camera", "record", "recording", "film", "camcorder", "video call", "webcam"],
  slots: { primary: "camera", accent: "record light" },
  defaultVariant: "record",
  variants: {
    // the record light dims and swells back, like a camera starting to roll
    record: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=light]",
          { scale: [1, 0.6, 1.2, 1], opacity: [1, 0.35, 1, 1] },
          { duration: seconds, times: [0, 0.3, 0.65, 1], ease: "easeInOut" },
        ),
    },
    // the lens hood flexes open and settles, zooming in on its subject
    zoom: {
      duration: 650,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=lens]",
          { scaleY: [1, 1.2, 0.9, 1] },
          { duration: seconds, times: [0, 0.35, 0.7, 1], ease: "easeInOut" },
        ),
    },
    // the whole camera draws back and pushes in toward the subject
    nudge: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=camera]",
          { x: [0, -1, 2, 0] },
          { duration: seconds, times: [0, 0.3, 0.65, 1], ease: ease.out },
        ),
    },
  },
  render: () => (
    <g data-part="camera">
      <path d={BODY} />
      {/* the hood opens off the body's right edge; its ends sit on that edge, so it can flex without a seam */}
      <path d={LENS} data-part="lens" style={pivot("0% 50%")} />
      {/* a record light is round, so it gets a true circle */}
      <circle cx="9" cy="12" data-part="light" fill={slot.accent} r="2.5" stroke="none" style={pivot("50% 50%")} />
    </g>
  ),
})
