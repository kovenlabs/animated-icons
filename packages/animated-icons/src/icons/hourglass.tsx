"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    hourglass: "flip" | "drain" | "tilt"
  }
}

/** 2 colors: glass (primary), sand (accent). */
export const Hourglass = createAnimatedIcon({
  name: "hourglass",
  category: "time",
  keywords: ["timer", "wait", "sand", "time", "loading", "countdown", "pending"],
  slots: { primary: "glass", accent: "sand" },
  defaultVariant: "flip",
  variants: {
    // turned over on its centre. The glass is symmetric, so at the half turn the frame snaps back to
    // rest unseen; the sand, which has swapped ends and hangs 3px high, holds a beat and drops into place
    flip: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=hourglass]",
            { rotate: [0, 180, 0] },
            { duration: seconds, times: [0, 0.5, 0.5], ease: ["easeInOut", "linear"] },
          ),
          animate(
            "[data-part=sand]",
            { y: [0, 0, -3, -3, 0] },
            { duration: seconds, times: [0, 0.5, 0.5, 0.6, 1], ease: ["linear", "linear", "linear", ease.in] },
          ),
        ]),
    },
    // a stream runs through the neck: the top sinks into the funnel while the pile grows, then both
    // ease back for the next turn
    drain: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=top]",
            { scale: [1, 0.55, 0.55, 1] },
            { duration: seconds, times: [0, 0.65, 0.8, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=pile]",
            { scale: [1, 1.2, 1.2, 1] },
            { duration: seconds, times: [0, 0.65, 0.8, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=stream]",
            { opacity: [0, 1, 1, 0] },
            { duration: seconds * 0.7, times: [0, 0.1, 0.85, 1], ease: "linear" },
          ),
        ]),
    },
    // tipped on its base and set back down, like a nudge to hurry
    tilt: {
      duration: 700,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=hourglass]",
          { rotate: [0, -12, 9, -4, 0] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <g data-part="hourglass" style={pivot("50% 50%")}>
      {/* two bars and two crossing walls: the bulbs pinch shut at the neck */}
      <path d="M4 2h16M4 22h16" />
      <path d="M5 2v3l7 7-7 7v3M19 2v3l-7 7 7 7v3" />
      <g data-part="sand" fill={slot.accent} stroke="none">
        {/* the top sand fills the funnel down towards the neck; the pile sits on the bottom bar */}
        <path data-part="top" d="M8 6h8l-4 4z" style={pivot("50% 100%")} />
        <path data-part="pile" d="M8 21l4-4 4 4z" style={pivot("50% 100%")} />
      </g>
      <path data-part="stream" d="M12 14.5v1.5" stroke={slot.accent} style={flash()} />
    </g>
  ),
})
