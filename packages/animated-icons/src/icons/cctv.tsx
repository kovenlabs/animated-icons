"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    cctv: "pan" | "spot" | "record"
  }
}

/**
 * The camera head turns on its mount, where the arm meets the housing at (15, 12). The head's box
 * runs 5..20 × 4..12, so that joint is 2/3 across its bottom edge.
 */
const JOINT = "66.667% 100%"

/** 2 colors: housing + mount (primary), recording light (accent). */
export const Cctv = createAnimatedIcon({
  name: "cctv",
  category: "security",
  keywords: ["camera", "surveillance", "security camera", "monitoring", "watch", "recording", "cam"],
  slots: { primary: "housing + mount", accent: "recording light" },
  defaultVariant: "pan",
  variants: {
    // patrols: the head swings down to look at the floor, then tips up, foreshortening as it turns
    // away from you, holding each look while the light blinks
    pan: {
      duration: 1400,
      run: ({ animate, seconds }) => {
        const times = [0, 0.2, 0.4, 0.6, 0.8, 1]
        return Promise.all([
          animate(
            "[data-part=head]",
            { rotate: [0, -16, -16, 6, 6, 0], scaleX: [1, 0.78, 0.82, 0.78, 0.82, 1] },
            { duration: seconds, times, ease: "easeInOut" },
          ),
          animate(
            "[data-part=light]",
            { opacity: [1, 1, 0.15, 1, 0.15, 1], scale: [1, 1, 0.7, 1.3, 0.7, 1] },
            { duration: seconds, times, ease: "easeInOut" },
          ),
        ])
      },
    },
    // spotted you: the head whips down to stare out of the screen, overshooting, the lens punches
    // forward and the light flares, then it slowly turns away again
    spot: {
      duration: 1200,
      run: ({ animate, seconds }) => {
        const times = [0, 0.18, 0.28, 0.36, 0.72, 1]
        return Promise.all([
          animate(
            "[data-part=head]",
            { rotate: [0, -24, -14, -18, -18, 0], scale: [1, 1.1, 1.03, 1.06, 1.06, 1] },
            { duration: seconds, times, ease: [ease.in, "easeOut", "easeInOut", "linear", "easeInOut"] },
          ),
          animate(
            "[data-part=lens]",
            { scaleX: [1, 1, 1.6, 1.4, 1.4, 1] },
            { duration: seconds, times, ease: ["linear", ease.overshoot, "easeOut", "linear", "easeInOut"] },
          ),
          animate(
            "[data-part=light]",
            { scale: [1, 1, 1.9, 1.4, 1.4, 1] },
            { duration: seconds, times, ease: "easeOut" },
          ),
        ])
      },
    },
    // rolling: the light blinks REC twice while the lens zooms in and back, the housing bracing
    // against the kick
    record: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=light]",
            { opacity: [1, 0.1, 1, 0.1, 1], scale: [1, 0.6, 1.5, 0.6, 1] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=lens]",
            { scaleX: [1, 1.8, 1.8, 1] },
            { duration: seconds, times: [0, 0.3, 0.65, 1], ease: [ease.out, "linear", "easeInOut"] },
          ),
          animate(
            "[data-part=head]",
            { rotate: [0, -4, 0, 0, -4, 0], scaleY: [1, 0.9, 1, 1, 0.9, 1] },
            { duration: seconds, times: [0, 0.1, 0.25, 0.65, 0.75, 1], ease: "easeOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      {/* the wall plate and the arm that holds the camera out from it */}
      <path d="M21 14v5" />
      <path d="M15 12v4h6" />
      <g data-part="head" style={pivot(JOINT)}>
        <path d="M8 4h12v8H8Z" />
        {/* the lens hood out front: it telescopes from the housing */}
        <path data-part="lens" d="M8 6H5v4h3" style={pivot("100% 50%")} />
        <rect data-part="light" x="15" y="7" width="2" height="2" fill={slot.accent} stroke="none" style={pivot("50% 50%")} />
      </g>
    </>
  ),
})
