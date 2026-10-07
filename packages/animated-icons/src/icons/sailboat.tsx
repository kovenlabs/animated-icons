"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    sailboat: "tack" | "sail" | "gust"
  }
}

/** 2 colors: hull and mast (primary), sails and wind (accent). */
export const Sailboat = createAnimatedIcon({
  name: "sailboat",
  category: "transport",
  keywords: ["sailing", "yacht", "boat", "sea", "regatta", "nautical", "voyage", "marina"],
  slots: { primary: "hull + mast", accent: "sails + wind" },
  defaultVariant: "tack",
  variants: {
    // comes about: the boat swings round to face the other way, hull narrowing bow-on and sails swinging
    // across the mast, heels on the new tack, then turns back
    tack: {
      duration: 1400,
      run: ({ animate, seconds }) => {
        const times = [0, 0.2, 0.4, 0.6, 0.8, 1]
        return Promise.all([
          animate(
            "[data-part=hull]",
            { scaleX: [1, 0.35, 1, 1, 0.35, 1] },
            { duration: seconds, times, ease: "easeInOut" },
          ),
          animate(
            "[data-part=rig]",
            { scaleX: [1, 0, -1, -1, 0, 1] },
            { duration: seconds, times, ease: "easeInOut" },
          ),
          animate(
            "[data-part=boat]",
            { rotate: [0, 0, -7, 0, 0, 7, 0], y: [0, -1, 0, 0, -1, 0, 0] },
            { duration: seconds, times: [0, 0.2, 0.4, 0.5, 0.7, 0.88, 1], ease: "easeInOut" },
          ),
        ])
      },
    },
    // heels over and sails off to the right, then glides back in from the left and rights itself
    sail: {
      clip: true,
      duration: 1200,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=boat]",
          { x: [0, 10, -10, 0], rotate: [0, 10, 10, 0], opacity: [1, 0, 0, 1] },
          { duration: seconds, times: [0, 0.42, 0.52, 1], ease: [ease.in, "linear", ease.out] },
        ),
    },
    // a gust streaks in: the sails belly out, the boat heels hard and rocks back upright
    gust: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=wind]", { x: [-3, 1, 3], opacity: [0, 1, 0] }, { duration: seconds * 0.45, ease: "easeOut" }),
          animate(
            "[data-part=rig]",
            { scaleX: [1, 1, 1.18, 0.96, 1], skewY: [0, 0, -6, 2, 0] },
            { duration: seconds, times: [0, 0.15, 0.4, 0.7, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=boat]",
            { rotate: [0, 0, 14, -6, 3, 0] },
            { duration: seconds, times: [0, 0.18, 0.42, 0.66, 0.84, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      <g data-part="wind" stroke={slot.accent} style={flash()}>
        <path d="M2 5h3" />
        <path d="M2 9h2" />
      </g>
      <g data-part="boat" style={pivot("50% 100%")}>
        {/* the rig turns on the mast: a tall mainsail aft, a smaller jib forward, both on one boom */}
        <g data-part="rig" style={pivot("50% 100%")}>
          <path d="M12 2.5 19.5 13h-15L12 6" stroke={slot.accent} />
          <path d="M12 2.5V13" />
        </g>
        <g data-part="hull" style={pivot("50% 50%")}>
          {/* a flat deck and a raked hull, the mast stepped on the deck */}
          <path d="M12 13v4M3 17h18l-3 4H6Z" />
        </g>
      </g>
    </>
  ),
})
