"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { blink, ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    guitar: "strum" | "spin" | "jump"
  }
}

/** 2 colors: guitar (primary), sound hole and sound (accent). */
export const Guitar = createAnimatedIcon({
  name: "guitar",
  category: "media",
  keywords: ["acoustic guitar", "instrument", "music", "strum", "band", "rock", "song", "strings"],
  slots: { primary: "guitar", accent: "sound hole + sound" },
  defaultVariant: "strum",
  variants: {
    // strummed three times: the body rocks on its base, the sound hole throbs with each strum and
    // sound rings off both shoulders
    strum: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=guitar]",
            { rotate: [0, -7, 5, -4, 2, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=hole]",
            { scale: [1, 1.5, 1, 1.4, 1, 1.3, 1] },
            { duration: seconds, times: [0, 0.08, 0.3, 0.38, 0.6, 0.68, 1], ease: "easeOut" },
          ),
          animate("[data-part=wave]", blink, {
            duration: seconds * 0.45,
            delay: stagger(seconds * 0.3, { startDelay: seconds * 0.05 }),
            ease: "easeOut",
          }),
        ]),
    },
    // spun on its stand: one full turn about its neck, leaning into perspective as it goes edge-on
    spin: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=guitar]",
          { scaleX: [1, 0, -1, 0, 1], skewY: [0, 10, 0, -10, 0], y: [0, -1.5, -2, -1.5, 0] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    // a rock-star jump: it crouches, leaps with a stretch and a tilt of the neck, and lands with a squash
    jump: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=jump]",
          {
            y: [0, 0.5, -3, 0, 0],
            scaleY: [1, 0.88, 1.08, 0.86, 1],
            scaleX: [1, 1.06, 0.95, 1.08, 1],
            rotate: [0, 0, -10, 0, 0],
          },
          { duration: seconds, times: [0, 0.15, 0.5, 0.78, 1], ease: ["easeOut", "easeOut", "easeIn", ease.overshoot] },
        ),
    },
  },
  render: () => (
    <>
      <g stroke={slot.accent}>
        <path data-part="wave" d="M6 6 3 3" style={flash("100% 100%")} />
        <path data-part="wave" d="M18 18l3 3" style={flash("0% 0%")} />
      </g>
      <g data-part="jump" style={pivot("50% 100%")}>
        {/* drawn upright, then laid on the diagonal: headstock top right, body bottom left */}
        <g transform="rotate(45 12 12)">
          <g data-part="guitar" style={pivot("50% 100%")}>
            {/* a small solid headstock, a long neck, and a faceted body: narrow upper bout, a waist,
                a wide lower bout */}
            <path d="M11 -1h2v3h-2z" />
            <path d="M12 2v7" />
            <path d="M9 9h6l2 2-1 2 3 3v3l-2 2H7l-2-2v-3l3-3-1-2z" />
            {/* the sound hole is round, so a true circle, 2 clear of the waist and the base */}
            <circle cx="12" cy="16" data-part="hole" fill={slot.accent} r="2" stroke="none" style={pivot("50% 50%")} />
          </g>
        </g>
      </g>
    </>
  ),
})
