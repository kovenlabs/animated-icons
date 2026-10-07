"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    highlighter: "highlight" | "twirl" | "uncap"
  }
}

/** 2 colors: barrel (primary), chisel tip, cap and the ink it lays down (accent). */
export const Highlighter = createAnimatedIcon({
  name: "highlighter",
  category: "design",
  keywords: ["highlight", "marker", "emphasize", "mark up", "annotate", "felt tip", "text color"],
  slots: { primary: "barrel", accent: "chisel tip + cap + ink" },
  defaultVariant: "highlight",
  variants: {
    // leans into the paper and swipes right, leaving a translucent band behind the tip; it lifts off
    // and slides home as the band fades. The cap slides out of the frame and back, so it clips
    highlight: {
      duration: 1200,
      clip: true,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=pen]",
            { x: [0, 0, 6, 6, 0], y: [0, 0, 0, -2, 0], skewX: [0, -10, -10, 0, 0] },
            { duration: seconds, times: [0, 0.12, 0.55, 0.7, 1], ease: ["easeOut", "easeInOut", "easeOut", "easeInOut"] },
          ),
          // grows with the tip, hidden until it has width
          animate(
            "[data-part=ink]",
            { scaleX: [0, 0, 1, 1, 1], opacity: [0, 0, 1, 1, 0] },
            { duration: seconds, times: [0, 0.12, 0.55, 0.75, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // pops up toward you and turns a full circle about its own axis, mirrored halfway, then lands
    twirl: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=pen]",
            { y: [0, -3, 0, 0], scale: [1, 1.2, 0.94, 1] },
            { duration: seconds, times: [0, 0.4, 0.75, 1], ease: ["easeOut", ease.in, ease.overshoot] },
          ),
          animate("[data-part=turn]", { scaleX: [1, -1, 1] }, { duration: seconds * 0.75, ease: "easeInOut" }),
        ]),
    },
    // the cap pops off along the barrel, spins a full turn in the air and snaps back on (no overshoot: it
    // would push into the barrel); a full turn looks like rest, so it snaps back to 0 unseen
    uncap: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=cap]",
          { x: [0, 3, 3, 0, 0], y: [0, -3, -3, 0, 0], rotate: [0, 0, 360, 360, 0] },
          { duration: seconds, times: [0, 0.25, 0.7, 0.999, 1], ease: [ease.out, "easeInOut", ease.in, snap] },
        ),
    },
  },
  render: () => (
    <>
      {/* the highlighted band, under the tip's path: only exists in motion */}
      <path
        data-part="ink"
        d="M3 18h12v4H3Z"
        fill={slot.accent}
        fillOpacity={0.45}
        stroke="none"
        style={flash("0% 50%")}
      />
      <g data-part="pen" style={pivot("0% 100%")}>
        <g data-part="turn" style={pivot("50% 50%")}>
          {/* a stout 45° barrel */}
          <path d="M8 12l7-7 4 4-7 7Z" />
          {/* the chisel tip, cut flat where it meets the paper */}
          <path d="M8 12l-5 5v3h6l3-4" stroke={slot.accent} />
          {/* the cap on the far end of the barrel */}
          <path data-part="cap" d="M15 5l2-2 4 4-2 2" stroke={slot.accent} style={pivot("50% 50%")} />
        </g>
      </g>
    </>
  ),
})
