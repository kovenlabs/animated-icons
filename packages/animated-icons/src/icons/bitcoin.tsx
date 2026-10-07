"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { flash, pivot, slot } from "../lib/motion"
import { spin } from "../lib/spin"

declare module "../lib/types" {
  interface IconVariants {
    bitcoin: "spin" | "bounce" | "tilt"
  }
}

const TURN = spin(2)

/** 2 colors: B (primary), the ticks through it and its rim (accent). */
export const Bitcoin = createAnimatedIcon({
  name: "bitcoin",
  category: "finance",
  keywords: ["btc", "crypto", "cryptocurrency", "blockchain", "currency", "satoshi", "digital money", "payment"],
  slots: { primary: "B", accent: "ticks + rim" },
  defaultVariant: "spin",
  variants: {
    // tossed up spinning on its edge: two turns that slow as it falls, a squash as it lands, and still
    // turning on the table. Side-on, the flat sign shows its rim
    spin: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=coin]", { scaleX: TURN.scaleX }, { duration: seconds, times: TURN.times, ease: TURN.ease }),
          animate("[data-part=rim]", { opacity: TURN.edge }, { duration: seconds, times: TURN.times, ease: TURN.ease }),
          animate(
            "[data-part=bitcoin]",
            { y: [0, -4, 0, 0] },
            { duration: seconds, times: [0, 0.35, 0.68, 1], ease: ["easeOut", "easeIn", "linear"] },
          ),
          animate(
            "[data-part=bitcoin]",
            { scaleY: [1, 1, 0.86, 1.04, 1] },
            { duration: seconds, times: [0, 0.68, 0.76, 0.86, 1], ease: "easeOut" },
          ),
        ]),
    },
    // squash, a stretched leap and a squashed landing; the ticks spring on their bars a beat behind
    bounce: {
      duration: 1000,
      clip: false,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=bitcoin]",
            { y: [0, 0, -5, 0, 0], scaleY: [1, 0.8, 1.12, 0.84, 1], scaleX: [1, 1.15, 0.9, 1.12, 1] },
            { duration: seconds, times: [0, 0.2, 0.48, 0.72, 1], ease: ["easeOut", "easeOut", "easeIn", "easeOut"] },
          ),
          animate(
            "[data-part=ticks]",
            { scaleY: [1, 0.7, 1.5, 0.6, 1.2, 1] },
            { duration: seconds, times: [0, 0.24, 0.52, 0.76, 0.88, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // rocks a third of a turn each way, its near side swinging toward you
    tilt: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=coin]",
          { scaleX: [1, 0.55, 1, 0.55, 1], skewY: [0, -12, 0, 12, 0] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <g data-part="bitcoin" style={pivot("50% 100%")}>
      <g data-part="coin" style={pivot("50% 50%")}>
        {/* a faceted B: square back, two bevelled bowls, the lower one wider; serifs reach 2 left of the stem */}
        <path d="M6 5h8l2.5 2.5v2L14 12h1.5l2.5 2.5v2L15.5 19H6M8 12h6M8 5v14" />
        <g stroke={slot.accent}>
          {/* the stem runs on through the top and bottom bars, a second tick beside it */}
          <path data-part="ticks" d="M8 2v3M12 2v3" style={pivot("50% 100%")} />
          <path data-part="ticks" d="M8 19v3M12 19v3" style={pivot("50% 0%")} />
        </g>
      </g>
      {/* the coin's rim, seen only side-on */}
      <rect data-part="rim" x="11" y="3" width="2" height="18" fill={slot.accent} stroke="none" style={flash()} />
    </g>
  ),
})
