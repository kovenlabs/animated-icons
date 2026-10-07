"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    clapperboard: "snap" | "turn" | "action"
  }
}

/** How far the clapper stands open at rest, in degrees about its hinge. */
const OPEN = 12

/** 2 colors: slate (primary), clapper stick (accent). */
export const Clapperboard = createAnimatedIcon({
  name: "clapperboard",
  category: "media",
  keywords: ["clapper", "slate", "movie", "film", "cinema", "action", "take", "director"],
  slots: { primary: "slate", accent: "clapper stick" },
  defaultVariant: "snap",
  variants: {
    // the stick is raised a little higher, slams shut with a bounce, and the slate jolts at the clap
    // before the stick lifts back open
    snap: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=stick]",
            { rotate: [0, -8, OPEN, OPEN - 3, OPEN, OPEN, 0] },
            {
              duration: seconds,
              times: [0, 0.25, 0.4, 0.48, 0.55, 0.7, 1],
              ease: ["easeOut", ease.in, "easeOut", "easeIn", "linear", "easeInOut"],
            },
          ),
          animate(
            "[data-part=clapperboard]",
            { scaleY: [1, 1, 0.88, 1.04, 1], scaleX: [1, 1, 1.06, 0.98, 1], y: [0, 0, 0.5, -0.5, 0] },
            { duration: seconds, times: [0, 0.4, 0.46, 0.62, 1], ease: "easeOut" },
          ),
        ]),
    },
    // turned around on its vertical axis to show the back and swung back to face the camera, leaning
    // into perspective as it goes edge-on
    turn: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=clapperboard]",
          { scaleX: [1, 0, -1, 0, 1], skewY: [0, -12, 0, 12, 0], y: [0, -1.5, -2, -1.5, 0] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    // thrust at the camera: it comes forward, tilted, the stick claps shut at the closest point, and
    // it springs back into place
    action: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=clapperboard]",
            { scale: [1, 1.3, 1.3, 1], rotate: [0, -8, -8, 0], y: [0, -1, -1, 0] },
            { duration: seconds, times: [0, 0.35, 0.6, 1], ease: ["easeOut", "linear", ease.overshoot] },
          ),
          animate(
            "[data-part=stick]",
            { rotate: [0, -6, OPEN, OPEN, 0] },
            { duration: seconds, times: [0, 0.3, 0.42, 0.65, 1], ease: ["easeOut", ease.in, "linear", "easeInOut"] },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="clapperboard" style={pivot("50% 100%")}>
      {/* the slate */}
      <path d="M3 11h18v10H3z" />
      {/* the stick is drawn closed along the slate's top edge and stood open about its hinge, the
          slate's top-left corner; it claps by rotating OPEN degrees back down */}
      <g transform={`rotate(${-OPEN} 3 11)`} stroke={slot.accent}>
        <g data-part="stick" style={pivot("0% 100%")}>
          <path d="M3 11h18V7H3z" />
          {/* two raked stripes, 2+ clear of the ends and of each other */}
          <path d="M10 7l-2 4M15 7l-2 4" />
        </g>
      </g>
    </g>
  ),
})
