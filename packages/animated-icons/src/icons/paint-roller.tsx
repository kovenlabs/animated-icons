"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "paint-roller": "roll" | "twirl" | "press"
  }
}

/** 2 colors: frame and handle (primary), roller and the paint it lays (accent). */
export const PaintRoller = createAnimatedIcon({
  name: "paint-roller",
  family: "paint",
  category: "design",
  keywords: ["paint", "roller", "decorate", "wall", "redecorate", "renovate", "coat", "fill"],
  slots: { primary: "frame + handle", accent: "roller + paint" },
  defaultVariant: "roll",
  variants: {
    // rolls down the wall laying a band of paint behind it, then rolls back up over the fresh coat,
    // which fades. The handle slides out of the bottom of the frame and back, so it clips
    roll: {
      duration: 1300,
      clip: true,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=paint-roller]",
            { y: [0, 6, 6, 0] },
            { duration: seconds, times: [0, 0.45, 0.55, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=coat]",
            { scaleY: [0, 0.1, 1, 1, 1], opacity: [0, 1, 1, 1, 0] },
            { duration: seconds, times: [0, 0.05, 0.45, 0.75, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // swells toward you and twirls a full circle about its handle, mirrored halfway, then settles
    twirl: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=paint-roller]",
            { scale: [1, 1.12, 0.95, 1] },
            { duration: seconds, times: [0, 0.4, 0.75, 1], ease: ["easeOut", "easeIn", ease.overshoot] },
          ),
          animate("[data-part=turn]", { scaleX: [1, -1, 1] }, { duration: seconds * 0.75, ease: "easeInOut" }),
        ]),
    },
    // pushed into the wall: the whole tool recedes as the roller squashes flat, then springs back out
    // past its size and the roller wobbles after it
    press: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=paint-roller]",
            { scale: [1, 0.84, 1.06, 1] },
            { duration: seconds, times: [0, 0.35, 0.65, 1], ease: ["easeIn", ease.out, "easeInOut"] },
          ),
          animate(
            "[data-part=roller]",
            { scaleY: [1, 0.65, 1.15, 0.92, 1], scaleX: [1, 1.08, 0.96, 1.02, 1] },
            { duration: seconds, times: [0, 0.35, 0.6, 0.8, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      {/* the fresh coat on the wall, under the roller: only exists in motion */}
      <path
        data-part="coat"
        d="M3 2h14v8H3Z"
        fill={slot.accent}
        fillOpacity={0.35}
        stroke="none"
        style={flash("50% 0%")}
      />
      <g data-part="paint-roller" style={pivot("50% 50%")}>
        {/* twirls about the handle's axis */}
        <g data-part="turn" style={pivot("53% 50%")}>
          <path data-part="roller" d="M3 2h14v6H3Z" stroke={slot.accent} style={pivot("50% 50%")} />
          {/* the frame runs out of the roller's end, round its back and down into the handle */}
          <path d="M17 5h3v7h-8v3" />
          <path d="M10 15h4v7h-4Z" />
        </g>
      </g>
    </>
  ),
})
