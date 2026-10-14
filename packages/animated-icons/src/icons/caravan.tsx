"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    caravan: "tow" | "bump" | "camp"
  }
}

/** 2 colors: shell, wheel and hitch (primary), window and door (accent). */
export const Caravan = createAnimatedIcon({
  name: "caravan",
  category: "transport",
  keywords: ["camper", "trailer", "rv", "motorhome", "camping", "road trip", "holiday", "travel"],
  slots: { primary: "shell + wheel + hitch", accent: "window + door" },
  defaultVariant: "tow",
  variants: {
    // towed away: it lurches back as the car pulls, bounces off out of the right side over the bumps
    // and rolls in from the left, pitching forward as it brakes
    tow: {
      clip: true,
      duration: 1400,
      run: ({ animate, seconds }) => {
        const times = [0, 0.12, 0.3, 0.45, 0.5, 0.65, 0.8, 0.9, 1]
        return Promise.all([
          animate(
            "[data-part=caravan]",
            {
              x: [0, 0, 6, 22, -22, -8, 0, 0, 0],
              y: [0, 0, -1, 0, 0, -1, 0, 0, 0],
              rotate: [0, -6, 2, -3, -3, 2, 6, -2, 0],
            },
            {
              duration: seconds,
              times,
              ease: ["easeOut", ease.in, "linear", snap, "linear", ease.out, "easeInOut", "easeOut"],
            },
          ),
        ])
      },
    },
    // hits a pothole: the wheel drops, the shell slams down after it squashing on its springs, then
    // bounces up and settles
    bump: {
      duration: 900,
      run: ({ animate, seconds }) => {
        const times = [0, 0.2, 0.4, 0.65, 1]
        return Promise.all([
          animate("[data-part=wheel]", { y: [0, 1, 0, 0, 0] }, { duration: seconds, times, ease: "easeInOut" }),
          animate(
            "[data-part=shell]",
            { y: [0, 0, 1, -1.5, 0], scaleY: [1, 1, 0.86, 1.04, 1], scaleX: [1, 1, 1.05, 0.98, 1], rotate: [0, 0, 3, -2, 0] },
            { duration: seconds, times, ease: "easeInOut" },
          ),
        ])
      },
    },
    // pitching camp: the door swings open towards you and shut again, the window lights up, and the
    // shell rocks as someone steps inside
    camp: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=door]",
            { scaleX: [1, 0.15, 0.15, 1.1, 1], skewY: [0, -14, -14, 4, 0] },
            { duration: seconds * 0.8, times: [0, 0.3, 0.6, 0.85, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=window]",
            { scale: [1, 1, 1.5, 1], opacity: [1, 0.3, 1, 1] },
            { duration: seconds * 0.6, delay: seconds * 0.35, times: [0, 0.3, 0.6, 1], ease: ease.out },
          ),
          animate(
            "[data-part=shell]",
            { rotate: [0, 0, 2.5, -1.5, 0], scaleY: [1, 1, 0.95, 1.01, 1] },
            { duration: seconds, times: [0, 0.4, 0.55, 0.75, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="caravan" style={pivot("50% 100%")}>
      <g data-part="shell" style={pivot("40% 100%")}>
        {/* a boxy shell with a raked front, the hitch bar reaching forward from its base */}
        <path d="M2 17V6h13l4 4v7H2Z" />
        <path d="M19 15h3" />
        <rect data-part="window" x="5" y="9" width="3" height="3" fill={slot.accent} stroke="none" style={pivot("50% 50%")} />
        <path data-part="door" d="M11 17v-5h4v5" stroke={slot.accent} style={pivot("100% 100%")} />
      </g>
      <circle data-part="wheel" cx="7" cy="19.5" r="2" />
    </g>
  ),
})
