"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { blink, ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "biceps-flexed": "flex" | "turn" | "strain"
  }
}

/** Power lines off the top of the bicep: only exist in motion. */
const RAYS = ["M18 6.5V4", "M20.5 7.5 22 6"]

/** The bulge's shared beat: wind down, then two pumps. */
const BEATS = [0, 0.18, 0.4, 0.55, 0.72, 1]

/** 2 colors: arm (primary), bicep and power lines (accent). */
export const BicepsFlexed = createAnimatedIcon({
  name: "biceps-flexed",
  category: "sports",
  keywords: ["strong", "muscle", "flex", "gym", "fitness", "workout", "strength", "power"],
  slots: { primary: "arm", accent: "bicep + power lines" },
  defaultVariant: "flex",
  variants: {
    // winds down into a squash, then pumps twice: the bicep balloons up off the arm toward you and
    // power lines burst off it on each beat
    flex: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=arm]",
            { scaleX: [1, 1.03, 1.04, 1.01, 1.04, 1], scaleY: [1, 0.92, 1.04, 1.01, 1.04, 1] },
            { duration: seconds, times: BEATS, ease: ["easeOut", ease.out, "easeInOut", ease.out, ease.overshoot] },
          ),
          animate(
            "[data-part=bicep]",
            { scale: [1, 0.9, 1.12, 1, 1.12, 1] },
            { duration: seconds, times: BEATS, ease: ["easeOut", ease.out, "easeInOut", ease.out, ease.overshoot] },
          ),
          animate("[data-part=ray]", blink, {
            duration: seconds * 0.35,
            delay: stagger(seconds * 0.32, { startDelay: seconds * 0.3 }),
            ease: "easeOut",
          }),
        ]),
    },
    // turns round on its upright axis to show off the other arm, rising toward you, and turns back
    turn: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=spin]",
            { scaleX: [1, 0, -1, -1, 0, 1], scaleY: [1, 1.03, 1, 1, 1.03, 1], y: [0, -1, 0, 0, -1, 0] },
            {
              duration: seconds,
              times: [0, 0.2, 0.4, 0.6, 0.8, 1],
              ease: ["easeIn", "easeOut", "linear", "easeIn", ease.overshoot],
            },
          ),
          animate(
            "[data-part=bicep]",
            { scale: [1, 1, 1.1, 1, 1] },
            { duration: seconds, times: [0, 0.4, 0.5, 0.6, 1], ease: "easeInOut" },
          ),
          animate("[data-part=ray]", blink, { duration: seconds * 0.3, delay: seconds * 0.4, ease: "easeOut" }),
        ]),
    },
    // holds the flex under strain: trembling harder as the bicep swells, then lets go with a bounce and
    // a burst of power
    strain: {
      duration: 1300,
      run: ({ animate, seconds }) => {
        const times = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.75, 1]
        return Promise.all([
          animate(
            "[data-part=arm]",
            {
              x: [0, -0.3, 0.3, -0.4, 0.4, -0.5, 0.5, 0, 0],
              rotate: [0, -0.6, 0.6, -0.9, 0.9, -1.2, 1.2, 0, 0],
              scale: [1, 1, 1.01, 1.01, 1.02, 1.02, 1.03, 0.95, 1],
            },
            { duration: seconds, times, ease: "linear" },
          ),
          animate(
            "[data-part=bicep]",
            { scale: [1, 1.02, 1.04, 1.06, 1.08, 1.1, 1.12, 0.92, 1] },
            { duration: seconds, times, ease: "easeInOut" },
          ),
          animate("[data-part=ray]", blink, {
            duration: seconds * 0.3,
            delay: stagger(seconds * 0.06, { startDelay: seconds * 0.7 }),
            ease: "easeOut",
          }),
        ])
      },
    },
  },
  render: () => (
    <>
      {/* the rays turn with the arm, so they stay off the bicep when it shows its other side; the
          pivot keeps the turn centred on the arm (x 12 in a 3.5..22 box that includes the rays) */}
      <g data-part="spin" style={pivot("45.95% 50%")}>
        <g stroke={slot.accent}>
          {RAYS.map((d) => (
            <path key={d} data-part="ray" d={d} style={flash("0% 100%")} />
          ))}
        </g>
        <g data-part="arm" style={pivot("0% 100%")}>
          {/* the bicep bulging up off the upper arm; it swells from where it meets the arm */}
          <path data-part="bicep" d="M14 11.5l1.5-1H18l2.5 2.5v3.5l-3 3" stroke={slot.accent} style={pivot("53.85% 100%")} />
          {/* the rest of the arm in one stroke: under the upper arm, round the elbow, up the forearm to
              the fist, and back down the inside of the forearm into the crook */}
          <path d="M17.5 19.5l-4.5 1H8.5l-4-1.5-1-2 1-6.5L7 5.5l3.5-2H12l2 2v1L12.5 8h-2l-2 8H13" />
        </g>
      </g>
    </>
  ),
})
