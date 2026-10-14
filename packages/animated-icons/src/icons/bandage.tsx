"use client"

import type { Easing } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    bandage: "stick" | "flip" | "stretch"
  }
}

/** A strip with chamfered ends, drawn level. */
const STRIP = "M5 8h14l2 2v4l-2 2H5l-2-2v-4Z"

/** 2 colors: strip (primary), pad (accent). */
export const Bandage = createAnimatedIcon({
  name: "bandage",
  category: "education",
  keywords: ["band-aid", "plaster", "first aid", "wound", "heal", "injury", "medical", "health"],
  slots: { primary: "strip", accent: "pad" },
  defaultVariant: "stick",
  variants: {
    // peeled up toward you with a twist, then slapped down flat, the pad pressing in with a squash
    stick: {
      duration: 900,
      run: ({ animate, seconds }) => {
        const timing = {
          duration: seconds,
          times: [0, 0.4, 0.6, 0.8, 1],
          ease: ["easeOut", ease.in, "easeOut", "easeInOut"] as Easing[],
        }
        return Promise.all([
          animate("[data-part=bandage]", { scale: [1, 1.2, 0.88, 1.04, 1], rotate: [0, -12, 0, 0, 0] }, timing),
          animate("[data-part=pad]", { scale: [1, 1, 0.7, 1.08, 1] }, timing),
        ])
      },
    },
    // turned over on its long axis, lifting toward you: the plain back shows, then it rolls face-up again
    flip: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=strip]",
            { scaleY: [1, 0, -1, -1, 0, 1] },
            { duration: seconds, times: [0, 0.2, 0.35, 0.6, 0.75, 1], ease: [ease.in, "easeOut", "linear", ease.in, "easeOut"] },
          ),
          animate(
            "[data-part=face]",
            { opacity: [1, 1, 0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.2, 0.201, 0.75, 0.751, 1], ease: ["linear", snap, "linear", snap, "linear"] },
          ),
          animate(
            "[data-part=bandage]",
            { scale: [1, 1.15, 1.15, 1] },
            { duration: seconds, times: [0, 0.3, 0.7, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // tugged at both ends like elastic: it stretches thin, snaps back short and fat, and settles
    stretch: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=strip]",
          { scaleX: [1, 1.15, 0.9, 1.04, 1], scaleY: [1, 0.78, 1.18, 0.96, 1] },
          { duration: seconds, times: [0, 0.35, 0.6, 0.8, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    // drawn level and tipped 45°, the way a plaster goes on
    <g transform="rotate(-45 12 12)">
      <g data-part="bandage" style={pivot("50% 50%")}>
        <g data-part="strip" style={pivot("50% 50%")}>
          <path d={STRIP} />
          {/* the pad: a solid square between two seams; the back of the strip is plain */}
          <g data-part="face">
            <rect data-part="pad" x="9" y="9" width="6" height="6" fill={slot.accent} stroke="none" style={pivot("50% 50%")} />
            <path d="M8 8v8M16 8v8" />
          </g>
        </g>
      </g>
    </g>
  ),
})
