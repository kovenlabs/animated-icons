"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    ear: "listen" | "wiggle" | "buzz"
  }
}

/** A sound wave heading into the ear's open front: only exists in motion. */
const WAVE = "M2.5 13 4 15l-1.5 2"

/** 2 colors: ear (primary), inner fold and sound waves (accent). */
export const Ear = createAnimatedIcon({
  name: "ear",
  category: "health",
  keywords: ["hearing", "listen", "sound", "audio", "deaf", "hear", "accessibility", "body"],
  slots: { primary: "ear", accent: "inner fold + sound waves" },
  defaultVariant: "listen",
  variants: {
    // sound waves roll in from the left; the ear pricks up, turning toward them in perspective, and
    // its inner fold quivers as they arrive
    listen: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=wave]",
            { opacity: [0, 1, 1, 0], x: [-1.5, 0, 1, 1.5], scale: [0.6, 1, 1, 0.8] },
            { duration: seconds * 0.4, delay: stagger(seconds * 0.18), ease: "easeOut" },
          ),
          animate(
            "[data-part=ear]",
            { scaleX: [1, 0.82, 0.82, 1.06, 1], skewY: [0, -6, -6, 0, 0], scale: [1, 1, 1, 1.04, 1] },
            { duration: seconds, times: [0, 0.25, 0.55, 0.75, 1], ease: ["easeOut", "linear", ease.overshoot, "easeInOut"] },
          ),
          animate(
            "[data-part=fold]",
            { scale: [1, 1, 1.15, 0.92, 1.1, 0.96, 1] },
            { duration: seconds, times: [0, 0.3, 0.42, 0.54, 0.66, 0.8, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // flaps on its root at the front of the head, folding toward and away from you as it goes
    wiggle: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=ear]",
          { rotate: [0, 12, -6, 8, -3, 0], scaleX: [1, 0.8, 1.04, 0.86, 1, 1] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    // ringing: the ear buzzes on the spot, the inner fold throbbing and waves flickering at its front
    buzz: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=ear]",
            { x: [0, -0.8, 0.8, -0.8, 0.8, -0.5, 0.5, 0], rotate: [0, -3, 3, -3, 3, -2, 2, 0] },
            { duration: seconds, ease: "linear" },
          ),
          animate(
            "[data-part=fold]",
            { scale: [1, 1.2, 0.9, 1.2, 0.9, 1.1, 1] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=wave]",
            { opacity: [0, 1, 0], x: [0, -0.5, -1] },
            { duration: seconds * 0.3, delay: stagger(seconds * 0.3), ease: "easeOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      <g stroke={slot.accent}>
        <path data-part="wave" d={WAVE} style={flash("0% 50%")} />
        <path data-part="wave" d={WAVE} style={flash("0% 50%")} />
      </g>
      <g data-part="ear" style={pivot("0% 60%")}>
        {/* the outer rim: up over the top, down the back and round under the lobe, open at the front */}
        <path d="M6 10l1-4 3-3h6l3 2 1 3v3l-2 3-2 2-1 2.5-2 2h-3l-2-2" />
        {/* the inner fold, curling down into the tragus */}
        <path
          data-part="fold"
          d="M15.5 9.5V8l-1-1H12l-1 1v2l1.5 1.5V13L11 14.5"
          stroke={slot.accent}
          style={pivot("50% 50%")}
        />
      </g>
    </>
  ),
})
