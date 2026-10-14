"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    forklift: "lift" | "drive" | "load"
  }
}

/** 2 colors: truck, mast and forks (primary), crate (accent). */
export const Forklift = createAnimatedIcon({
  name: "forklift",
  category: "transport",
  keywords: ["warehouse", "pallet", "lift truck", "logistics", "loading", "inventory", "storage"],
  slots: { primary: "truck + mast + forks", accent: "crate" },
  defaultVariant: "lift",
  variants: {
    // hoists the crate up the mast and back down: the crate squashes as it sets off and stretches when it stops
    lift: {
      clip: false,
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=carriage]",
            { y: [0, -7, -7, 0] },
            { duration: seconds, times: [0, 0.38, 0.6, 1], ease: [ease.inOut, "linear", ease.overshoot] },
          ),
          animate(
            "[data-part=crate]",
            { scaleY: [1, 0.8, 1.18, 0.94, 1, 1.12, 0.82, 1] },
            { duration: seconds, times: [0, 0.12, 0.4, 0.48, 0.6, 0.75, 0.9, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // pops a wheelie as it pulls away to the right, and rolls back in from the left with the crate bouncing
    drive: {
      clip: true,
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=truck]",
            { x: [0, 0, 12, -12, 0], opacity: [1, 1, 0, 0, 1] },
            { duration: seconds * 0.85, times: [0, 0.15, 0.5, 0.56, 1], ease: [ease.in, ease.in, "linear", ease.out] },
          ),
          animate(
            "[data-part=truck]",
            { rotate: [0, -5, -2, 0, 0] },
            { duration: seconds * 0.85, times: [0, 0.2, 0.45, 0.5, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=crate]",
            { scaleY: [1, 1, 0.8, 1.1, 1] },
            { duration: seconds, times: [0, 0.75, 0.85, 0.93, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // a crate drops in from above, stretched by the fall, and squashes onto the forks, which dip under it
    load: {
      clip: true,
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=crate]",
            { y: [-16, 0, 0], opacity: [0, 1, 1] },
            { duration: seconds, times: [0, 0.4, 1], ease: ease.in },
          ),
          animate(
            "[data-part=crate]",
            { scaleY: [1.3, 1.2, 0.7, 1.12, 0.96, 1] },
            { duration: seconds, times: [0, 0.38, 0.5, 0.66, 0.82, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=carriage]",
            { y: [0, 0, 1, -0.5, 0] },
            { duration: seconds, times: [0, 0.4, 0.52, 0.7, 1], ease: "easeOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="truck" style={pivot("10% 100%")}>
      {/* the cab: counterweight at the back, a raked pillar up to the overhead guard, which runs into the mast */}
      <path d="M2 19v-7h3l2-6h7M5 12h9M6 19h2" />
      <circle cx="4" cy="19" r="2" />
      <circle cx="10" cy="19" r="2" />
      <path d="M14 3v16" />
      <g data-part="carriage">
        {/* the forks slide up and down the mast itself, so the crate stands 2 clear of it */}
        <path d="M14 19h8" />
        <path data-part="crate" d="M18 14h4v5h-4Z" stroke={slot.accent} style={pivot("50% 100%")} />
      </g>
    </g>
  ),
})
