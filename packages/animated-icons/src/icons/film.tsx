"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    film: "roll" | "twist" | "zoom"
  }
}

/** One step of the strip: a frame is two rungs (10) tall, so moving one frame looks like rest. */
const FRAME = 10

/** A sprocket rung on each edge rail at height y, and optionally the frame line between the inner rails. */
const rungs = (y: number) => `M3 ${y}h4M17 ${y}h4`
const divider = (y: number) => `M7 ${y}h10`

/** 2 colors: strip (primary), sprocket holes (accent). */
export const Film = createAnimatedIcon({
  name: "film",
  category: "media",
  keywords: ["film strip", "movie", "cinema", "reel", "video", "footage", "35mm", "frames"],
  slots: { primary: "strip", accent: "sprocket holes" },
  defaultVariant: "roll",
  variants: {
    // the strip runs down through the gate by one frame: the rungs and frame lines slide along the rails,
    // the bottom ones fade out of the frame and new ones fade in from the top, then the pose snaps back
    roll: {
      duration: 900,
      clip: true,
      run: ({ animate, seconds }) => {
        const timing = { duration: seconds, times: [0, 0.999, 1], ease: [ease.inOut, snap] }
        return Promise.all([
          animate("[data-part=stay]", { y: [0, FRAME, 0] }, timing),
          animate("[data-part=out]", { y: [0, FRAME, 0], opacity: [1, 0, 1] }, timing),
          animate("[data-part=in]", { y: [0, FRAME, 0], opacity: [0, 1, 0] }, timing),
        ])
      },
    },
    // twists a full turn about its length: the strip goes edge-on twice, leaning into perspective each time
    twist: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=film]",
          { scaleX: [1, 0, -1, 0, 1], skewY: [0, 16, 0, -16, 0], y: [0, -1.5, 0, -1.5, 0] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    // flies toward the viewer, past the edges of the frame, and settles back into the screen
    zoom: {
      duration: 900,
      clip: true,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=film]",
          { scale: [1, 1.45, 1], rotate: [0, -6, 0] },
          { duration: seconds, times: [0, 0.4, 1], ease: ["easeOut", ease.overshoot] },
        ),
    },
  },
  render: () => (
    <g data-part="film" style={pivot("50% 50%")}>
      {/* four rails run the full height: the strip carries on past the frame */}
      <path d="M3 2v20M7 2v20M17 2v20M21 2v20" />
      {/* rungs every 5 (gaps of 3), a frame line every 10 */}
      <g data-part="stay">
        <path d={`${rungs(2)}${rungs(7)}${rungs(12)}`} stroke={slot.accent} />
        <path d={divider(7)} />
      </g>
      {/* the ones that leave through the bottom while it rolls */}
      <g data-part="out">
        <path d={`${rungs(17)}${rungs(22)}`} stroke={slot.accent} />
        <path d={divider(17)} />
      </g>
      {/* the ones that arrive from above: only there while it rolls */}
      <g data-part="in" style={flash()}>
        <path d={`${rungs(2 - FRAME)}${rungs(7 - FRAME)}`} stroke={slot.accent} />
        <path d={divider(7 - FRAME)} />
      </g>
    </g>
  ),
})
