"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "mic-vocal": "sing" | "twirl" | "drop"
  }
}

/** Voice ticks off the ball's open side, clear of the handle. */
const TICKS = [
  { d: "M7.5 3 6 1.5", origin: "100% 100%" },
  { d: "M7 6H5", origin: "100% 50%" },
]

/** 2 colors: handle + cable (primary), ball head + voice ticks (accent). */
export const MicVocal = createAnimatedIcon({
  name: "mic-vocal",
  family: "mic",
  category: "media",
  keywords: ["microphone", "singing", "karaoke", "vocals", "performance", "stage", "handheld", "concert"],
  slots: { primary: "handle + cable", accent: "ball head + voice ticks" },
  defaultVariant: "sing",
  variants: {
    // belting it out: the ball head throbs on the beat, swelling toward you and pinching back, the
    // handle sways with it and voice ticks burst off the side
    sing: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=head]",
            { scale: [1, 1.1, 0.92, 1.07, 1] },
            { duration: seconds, times: [0, 0.2, 0.45, 0.65, 1], ease: "easeInOut" },
          ),
          animate("[data-part=mic]", { rotate: [0, -6, 4, -3, 0] }, { duration: seconds, ease: "easeInOut" }),
          animate(
            "[data-part=tick]",
            { opacity: [0, 1, 0, 0, 1, 0], scale: [0.6, 1, 1.1, 0.6, 1.1, 1.2] },
            {
              duration: seconds * 0.85,
              times: [0, 0.15, 0.4, 0.5, 0.65, 1],
              delay: stagger(seconds * 0.08, { startDelay: seconds * 0.1 }),
              ease: "easeOut",
            },
          ),
        ]),
    },
    // flipped round like a showman: the whole mic spins about its upright, narrowing to an edge and
    // mirroring through, hopping up as it turns and landing with a squash
    twirl: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=mic]",
          {
            scaleX: [1, -1, 1, 1, 1],
            y: [0, -1, 0, 0.5, 0],
            scaleY: [1, 1, 1, 0.9, 1],
          },
          { duration: seconds, times: [0, 0.35, 0.7, 0.82, 1], ease: ["easeInOut", "easeInOut", "easeOut", ease.overshoot] },
        ),
    },
    // the mic drop: it tips, falls out through the floor, and drops back in from above, landing with
    // a squash
    drop: {
      clip: true,
      duration: 1200,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=mic]",
          {
            rotate: [0, -10, 18, 0, 0, 0],
            y: [0, -1.5, 24, -24, 0, 0],
            scaleY: [1, 1, 1.1, 1.1, 0.9, 1],
          },
          {
            duration: seconds,
            times: [0, 0.18, 0.45, 0.45, 0.78, 1],
            ease: ["easeOut", ease.in, "linear", ease.in, ease.overshoot],
          },
        ),
    },
  },
  render: () => (
    <>
      <g stroke={slot.accent}>
        {TICKS.map(({ d, origin }) => (
          <path key={d} data-part="tick" d={d} style={flash(origin)} />
        ))}
      </g>
      <g data-part="mic" style={pivot("50% 50%")}>
        {/* a tapered grip angled up into the ball, open where it enters it */}
        <path d="M11 8 5 16.5l2.5 2.5L15 12" />
        {/* the cable kinks out of the butt and trails off along the floor */}
        <path d="M6.25 17.75 3.5 20.5 5 22h5l3-2 4 2" />
        {/* the ball is genuinely round, so it is a true circle */}
        <circle data-part="head" cx="16" cy="7" r="5" stroke={slot.accent} style={pivot("50% 50%")} />
      </g>
    </>
  ),
})
