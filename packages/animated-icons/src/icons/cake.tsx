"use client"

import type { Easing } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, radial, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    cake: "blow" | "turntable" | "party"
  }
}

/**
 * Sprinkles round the cake's side, 4 apart (centres x 8, 12, 16). One turn of the turntable carries each
 * along to the next one's place, then snaps back unseen: the one at 16 slides round the edge and fades,
 * and a hidden one at 4 slides in from round the back to take 8's place.
 */
const SPRINKLES = [7, 11, 15]

/** Two turns, each one a slide and a snap back. */
const turns = { times: [0, 0.499, 0.5, 0.999, 1], ease: ["easeInOut", snap, "easeInOut", snap] as Easing[] }

const CONFETTI = radial(5, 9, -90)

/** 2 colors: cake and candle (primary), flame, sprinkles and confetti (accent). */
export const Cake = createAnimatedIcon({
  name: "cake",
  category: "social",
  keywords: ["birthday", "celebration", "party", "anniversary", "dessert", "candle", "bakery"],
  slots: { primary: "cake + candle", accent: "flame + sprinkles" },
  defaultVariant: "blow",
  variants: {
    // the flame flickers, is blown sideways and out in a wisp of smoke, then relights with a pop
    blow: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=flame]",
            { skewX: [0, -12, 10, 35, 0, 0, 0], scale: [1, 1.1, 0.95, 0, 0, 1.4, 1] },
            {
              duration: seconds,
              times: [0, 0.1, 0.22, 0.36, 0.66, 0.84, 1],
              ease: ["easeInOut", "easeInOut", ease.in, snap, ease.out, "easeInOut"],
            },
          ),
          animate(
            "[data-part=smoke]",
            { y: [0, -1, -3], x: [0, 1, 2], opacity: [0, 1, 0] },
            { duration: seconds * 0.4, delay: seconds * 0.33, ease: "easeOut" },
          ),
        ]),
    },
    // spun on a turntable: the sprinkles slide round the side, twice, while the flame leans into the turn
    turntable: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=sprinkle]", { x: [0, 4, 0, 4, 0] }, { duration: seconds, ...turns }),
          animate(
            "[data-part=sprinkle]:nth-of-type(3)",
            { opacity: [1, 0, 1, 0, 1], scaleX: [1, 0.3, 1, 0.3, 1] },
            { duration: seconds, ...turns },
          ),
          animate(
            "[data-part=incoming]",
            { x: [0, 4, 0, 4, 0], opacity: [0, 1, 0, 1, 0], scaleX: [0.3, 1, 0.3, 1, 0.3] },
            { duration: seconds, ...turns },
          ),
          animate(
            "[data-part=flame]",
            { skewX: [0, -18, -14, -18, 0] },
            { duration: seconds, times: [0, 0.2, 0.5, 0.8, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the cake jumps for joy: a squash, a stretch up, a landing; the flame flares and confetti bursts
    party: {
      duration: 1200,
      clip: true,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=cake]",
            { y: [0, 0, -3, 0, 0, 0], scaleY: [1, 0.88, 1.08, 0.86, 1.04, 1], scaleX: [1, 1.08, 0.95, 1.1, 0.98, 1] },
            {
              duration: seconds,
              times: [0, 0.14, 0.38, 0.6, 0.76, 1],
              ease: ["easeInOut", "easeOut", ease.in, "easeOut", "easeInOut"],
            },
          ),
          animate(
            "[data-part=flame]",
            { scale: [1, 1, 1.5, 1, 1] },
            { duration: seconds, times: [0, 0.3, 0.45, 0.8, 1], ease: ["linear", ease.out, "easeInOut", "linear"] },
          ),
          ...CONFETTI.map((to, i) =>
            animate(
              `[data-part=confetti]:nth-of-type(${i + 1})`,
              { x: [0, to.x], y: [0, to.y], opacity: [0, 1, 0], rotate: [0, 180] },
              { duration: seconds * 0.55, delay: seconds * 0.32, ease: "easeOut" },
            ),
          ),
        ]),
    },
  },
  render: () => (
    <>
      <g data-part="cake" style={pivot("50% 100%")}>
        {/* a round cake, so its top and base are true ellipses: the top seen from just above */}
        <ellipse cx="12" cy="11" rx="8" ry="2" />
        <path d="M4 11v8A8 2 0 0 0 20 19v-8" />
        {/* the candle stands on the middle of the top, in front of the far rim */}
        <path d="M12 11V7" />
        <path data-part="flame" d="M12 2l2 3-2 2-2-2Z" fill={slot.accent} stroke="none" style={pivot("50% 100%")} />
        <g fill={slot.accent} stroke="none">
          {SPRINKLES.map((x) => (
            <rect key={x} data-part="sprinkle" x={x} y="16" width="2" height="2" style={pivot("50% 50%")} />
          ))}
          <rect data-part="incoming" x="3" y="16" width="2" height="2" style={flash()} />
        </g>
      </g>
      <path data-part="smoke" d="M12 5.5 13 4l-1-1.5" style={flash("50% 100%")} />
      <g fill={slot.accent} stroke="none">
        {CONFETTI.map((_, i) => (
          <rect key={i} data-part="confetti" x="11" y="5" width="2" height="2" style={flash()} />
        ))}
      </g>
    </>
  ),
})
