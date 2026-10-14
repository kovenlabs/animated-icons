"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    signpost: "spin" | "point" | "gust"
  }
}

/** 2 colors: post (primary), direction boards (accent). */
export const Signpost = createAnimatedIcon({
  name: "signpost",
  category: "navigation",
  keywords: ["direction", "crossroads", "wayfinding", "route", "travel", "guide", "choice", "trail"],
  slots: { primary: "post", accent: "boards" },
  defaultVariant: "spin",
  variants: {
    // each board whirls a full turn round the post in perspective, the top one first and the lower one
    // a beat later, both overshooting home
    spin: {
      duration: 1200,
      run: ({ animate, seconds }) => {
        const turn = { scaleX: [1, -1, 1, 0.85, 1], skewY: [0, 6, -6, 2, 0] }
        const options = { duration: seconds * 0.75, times: [0, 0.3, 0.65, 0.85, 1], ease: "easeInOut" as const }
        return Promise.all([
          animate("[data-part=top]", turn, options),
          animate("[data-part=bottom]", turn, { ...options, delay: seconds * 0.25 }),
        ])
      },
    },
    // both boards wind back and jab the way they point, the lower one a beat after the top
    point: {
      duration: 900,
      run: ({ animate, seconds }) => {
        const jab = { duration: seconds * 0.7, times: [0, 0.2, 0.5, 0.75, 1], ease: "easeInOut" as const }
        return Promise.all([
          animate("[data-part=top]", { x: [0, -1, 2, -0.5, 0] }, jab),
          animate("[data-part=bottom]", { x: [0, 1, -2, 0.5, 0] }, { ...jab, delay: seconds * 0.3 }),
        ])
      },
    },
    // a gust bends the post from its foot while the boards flutter on it in perspective
    gust: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=post]", { rotate: [0, 5, -5, 2, 0] }, { duration: seconds, ease: "easeInOut" }),
          animate(
            "[data-part=top]",
            { skewY: [0, -12, 10, -6, 3, 0], scaleX: [1, 0.8, 0.9, 0.95, 1, 1] },
            { duration: seconds, delay: seconds * 0.05, ease: "easeInOut" },
          ),
          animate(
            "[data-part=bottom]",
            { skewY: [0, -10, 9, -5, 2, 0], scaleX: [1, 0.85, 0.8, 0.95, 1, 1] },
            { duration: seconds, delay: seconds * 0.1, ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="post" style={pivot("50% 100%")}>
      {/* the post shows above, between and below the boards */}
      <path d="M12 2v2M12 9v4M12 18v4" />
      <g stroke={slot.accent}>
        {/* two arrow boards centred on the post, 2px apart, pointing opposite ways */}
        <path data-part="top" d="M5 4h11l3 2.5L16 9H5Z" style={pivot("50% 50%")} />
        <path data-part="bottom" d="M19 13H8l-3 2.5L8 18h11Z" style={pivot("50% 50%")} />
      </g>
    </g>
  ),
})
