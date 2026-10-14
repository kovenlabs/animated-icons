"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    lollipop: "spin" | "twirl" | "wobble"
  }
}

/** 2 colors: candy and stick (primary), swirl (accent). */
export const Lollipop = createAnimatedIcon({
  name: "lollipop",
  category: "commerce",
  keywords: ["candy", "sweet", "sugar", "dessert", "treat", "confectionery", "kids"],
  slots: { primary: "candy + stick", accent: "swirl" },
  defaultVariant: "spin",
  variants: {
    // the swirl winds up and spins two hypnotic turns while the candy breathes in and out on its stick
    spin: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=swirl]", { rotate: [0, 720] }, { duration: seconds, ease: ease.inOut }),
          animate(
            "[data-part=head]",
            { scaleX: [1, 1.06, 0.97, 1.06, 1], scaleY: [1, 1.06, 0.97, 1.06, 1] },
            { duration: seconds, ease: "easeInOut" },
          ),
        ]),
    },
    // twirled between the fingers: the whole lollipop spins on its axis twice like a coin, narrowing to
    // an edge and showing its mirrored back, then settles
    twirl: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=lollipop]",
            { scaleX: [1, 0, -1, 0, 1, 0, -1, 0, 1, 1] },
            {
              duration: seconds,
              times: [0, 0.1, 0.2, 0.3, 0.4, 0.52, 0.64, 0.76, 0.88, 1],
              ease: ["easeIn", "easeOut", "easeIn", "easeOut", "easeIn", "easeOut", "easeIn", ease.overshoot, "linear"],
            },
          ),
          animate(
            "[data-part=lollipop]",
            { rotate: [0, -8, 6, 0] },
            { duration: seconds, times: [0, 0.4, 0.88, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // flicked: the candy wobbles on its stick like a bobble-head, squashing as it swings, and the swirl
    // lags round behind it
    wobble: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=head]",
            {
              rotate: [0, -12, 10, -6, 2, 0],
              scaleX: [1, 1.08, 0.94, 1.03, 1, 1],
              scaleY: [1, 0.92, 1.06, 0.98, 1, 1],
            },
            { duration: seconds, times: [0, 0.18, 0.4, 0.62, 0.82, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=swirl]",
            { rotate: [0, 30, -22, 12, -4, 0] },
            { duration: seconds, delay: seconds * 0.06, times: [0, 0.2, 0.42, 0.64, 0.84, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    // the lollipop's box runs 3..21 × 3..21, so it twirls about its middle
    <g data-part="lollipop" style={pivot("50% 50%")}>
      <path d="M16.5 16.5 21 21" />
      {/* the candy (box 3..19) hangs on its stick at (16.66, 16.66): 85.36% of the way across */}
      <g data-part="head" style={pivot("85.36% 85.36%")}>
        <circle cx="11" cy="11" r="8" />
        {/* two half-turns of a spiral (box 7..15 × 9..15) round the candy's centre at 50% 33.33% */}
        <path
          data-part="swirl"
          d="M11 11a2 2 0 0 1 4 0 4 4 0 0 1-8 0"
          stroke={slot.accent}
          style={pivot("50% 33.333%")}
        />
      </g>
    </g>
  ),
})
