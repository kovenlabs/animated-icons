"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { blink, ease, flash, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    crown: "coronate" | "shine" | "tilt"
  }
}

/** Small diamonds over the crown's three points that glint only in motion. */
const GLINTS = ["M3 4.5 4.5 6 3 7.5 1.5 6Z", "M12 2.5 13.5 4 12 5.5 10.5 4Z", "M21 4.5 22.5 6 21 7.5 19.5 6Z"]

/** 2 colors: crown and band (primary), jewel and glints (accent). */
export const Crown = createAnimatedIcon({
  name: "crown",
  category: "social",
  keywords: ["king", "queen", "royal", "premium", "vip", "winner", "champion", "leader"],
  slots: { primary: "crown + band", accent: "jewel + glints" },
  defaultVariant: "coronate",
  variants: {
    // the crown lifts off its band, turns over in the air, and drops back on with a squash
    coronate: {
      clip: true,
      duration: 1200,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=crown]",
          {
            y: [0, -5, -5, 0, 0, 0],
            scaleX: [1, 0.95, -1, 1, 1.1, 1],
            scaleY: [1, 1.05, 1.05, 1, 0.84, 1],
          },
          {
            duration: seconds,
            times: [0, 0.2, 0.45, 0.68, 0.8, 1],
            ease: ["easeOut", "easeInOut", "easeIn", "easeOut", ease.overshoot],
          },
        ),
    },
    // the jewel swells and turns while each point of the crown glints in turn
    shine: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=jewel]", { scale: [1, 1.6, 1] }, { duration: seconds * 0.7, ease: ease.out }),
          // a half turn lands on the diamond's own pose, so it snaps back to rest unseen
          animate(
            "[data-part=jewel]",
            { rotate: [0, 180, 0] },
            { duration: seconds * 0.7, times: [0, 0.999, 1], ease: [ease.out, snap] },
          ),
          animate("[data-part=glint]", blink, {
            duration: seconds * 0.45,
            delay: stagger(seconds * 0.15, { startDelay: seconds * 0.15 }),
            ease: "easeOut",
          }),
        ]),
    },
    // cocked to one side at a jaunty angle, then the other, rocking back level on the band
    tilt: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=crown]",
          { rotate: [0, -12, 10, -4, 0], skewX: [0, 6, -5, 2, 0], y: [0, -1.5, -1, -0.5, 0] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <>
      <g data-part="crown" style={pivot("50% 100%")}>
        {/* three points over straight flanks, a diamond jewel in the middle */}
        <path d="M3 6l4 4.5L12 4l5 6.5L21 6l-2 10H5Z" />
        <path
          data-part="jewel"
          d="M12 9.5l1.75 2.25L12 14l-1.75-2.25Z"
          fill={slot.accent}
          stroke="none"
          style={pivot("50% 50%")}
        />
      </g>
      <path d="M5 20h14" />
      <g fill={slot.accent} stroke="none">
        {GLINTS.map((d) => (
          <path key={d} data-part="glint" d={d} style={flash()} />
        ))}
      </g>
    </>
  ),
})
