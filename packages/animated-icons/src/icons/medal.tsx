"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { blink, ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    medal: "spin" | "swing" | "bestow"
  }
}

/** A five-pointed star centred in the medal. */
const STAR = "M12 13.2 12.8 15.2 14.9 15.3 13.2 16.6 13.8 18.6 12 17.5 10.2 18.6 10.8 16.6 9.2 15.3 11.2 15.2Z"

/** Diamonds either side of the medal's shoulders that only exist in motion. */
const SPARKLES = ["M3.5 10.5 5 12 3.5 13.5 2 12Z", "M20.5 10.5 22 12 20.5 13.5 19 12Z"]

/** 3 colors: medal (primary), ribbon (secondary), star and sparkles (accent). */
export const Medal = createAnimatedIcon({
  name: "medal",
  category: "social",
  keywords: ["prize", "winner", "gold", "olympics", "achievement", "first place", "champion", "sport"],
  slots: { primary: "medal", secondary: "ribbon", accent: "star + sparkles" },
  defaultVariant: "spin",
  variants: {
    // the medal turns twice on its vertical axis like a coin on its ribbon, the straps twisting after it
    spin: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=disc]",
            { scaleX: [1, -1, 1, -1, 1], scale: [1, 1.08, 1.08, 1.04, 1] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=ribbon]",
            { skewX: [0, 10, -10, 6, 0] },
            { duration: seconds, delay: seconds * 0.05, ease: "easeInOut" },
          ),
        ]),
    },
    // swings from the neck like a pendulum, the star rocking a beat behind the swing
    swing: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=medal]",
            { rotate: [0, 16, -12, 7, -3, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=star]",
            { rotate: [0, -24, 20, -10, 4, 0] },
            { duration: seconds, delay: seconds * 0.06, ease: "easeInOut" },
          ),
        ]),
    },
    // hung around your neck: it drops in from above, bounces on its ribbon, and a glint flashes
    bestow: {
      clip: true,
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=medal]",
            { y: [-22, 2, -1, 0], scaleY: [1.1, 0.9, 1.03, 1] },
            { duration: seconds * 0.7, times: [0, 0.5, 0.75, 1], ease: [ease.in, "easeOut", "easeInOut"] },
          ),
          animate(
            "[data-part=star]",
            { scale: [1, 1, 1.5, 1], rotate: [0, 0, 72, 0] },
            { duration: seconds, times: [0, 0.4, 0.7, 1], ease: ["linear", ease.out, "easeInOut"] },
          ),
          animate("[data-part=sparkle]", blink, { duration: seconds * 0.45, delay: seconds * 0.4, ease: "easeOut" }),
        ]),
    },
  },
  render: () => (
    <>
      <g fill={slot.accent} stroke="none">
        {SPARKLES.map((d) => (
          <path key={d} data-part="sparkle" d={d} style={flash()} />
        ))}
      </g>
      <g data-part="medal" style={pivot("50% 0%")}>
        {/* two straps in a V from the neck, tied by a crossbar, meeting the medal's rim */}
        <path data-part="ribbon" d="M6 2l4 8.3M18 2l-4 8.3M8 6h8" stroke={slot.secondary} style={pivot("50% 0%")} />
        <g data-part="disc" style={pivot("50% 50%")}>
          {/* a medal is round, so it gets a true circle */}
          <circle cx="12" cy="16" r="6" />
          <path data-part="star" d={STAR} fill={slot.accent} stroke="none" style={pivot("50% 55%")} />
        </g>
      </g>
    </>
  ),
})
