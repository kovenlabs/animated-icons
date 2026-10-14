"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { blink, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "utility-pole": "spark" | "seesaw" | "perch"
  }
}

/** Insulators along the crossarm, left to right: two per side, 4 apart, leaving the middle clear for a bird. */
const INSULATORS = [3, 7, 17, 21] as const

/** 2 colors: pole and crossarm (primary), insulators, sparks and bird (accent). */
export const UtilityPole = createAnimatedIcon({
  name: "utility-pole",
  category: "navigation",
  keywords: ["power line", "telephone pole", "electricity", "grid", "electric pole", "infrastructure", "wires"],
  slots: { primary: "pole + crossarm", accent: "insulators + sparks + bird" },
  defaultVariant: "spark",
  variants: {
    // current runs along the line: the insulators jump one after another, left to right, the pole hums, and sparks
    // crackle off both ends
    spark: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=insulator]",
            { scaleY: [1, 1.35, 0.9, 1] },
            { duration: seconds * 0.4, delay: stagger(seconds * 0.12), ease: "easeOut" },
          ),
          animate(
            "[data-part=pole]",
            { x: [0, -0.5, 0.5, -0.5, 0.5, -0.3, 0] },
            { duration: seconds, ease: "linear" },
          ),
          animate("[data-part=zap]", blink, { duration: seconds * 0.35, delay: stagger(seconds * 0.45), ease: "easeOut" }),
        ]),
    },
    // a gust catches the crossarm: it rocks on top of the pole and the insulators whip the other way behind it
    seesaw: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=arm]", { rotate: [0, -8, 7, -4, 2, 0] }, { duration: seconds, ease: "easeInOut" }),
          animate(
            "[data-part=insulator]",
            { rotate: [0, 10, -10, 6, -2, 0] },
            { duration: seconds * 0.94, delay: seconds * 0.06, ease: "easeInOut" },
          ),
        ]),
    },
    // a bird swoops in from the top right, lands on the crossarm with a squash that bends the pole, and flies off left
    perch: {
      clip: true,
      duration: 1500,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=bird]",
            {
              x: [9, 0, 0, 0, 0, -9],
              y: [-8, 0, 0.6, 0, 0, -8],
              opacity: [0, 1, 1, 1, 1, 0],
              scaleY: [0.6, 1, 0.7, 1, 1, 0.6],
              rotate: [20, 0, 0, 0, 0, -20],
            },
            { duration: seconds, times: [0, 0.3, 0.38, 0.48, 0.72, 1], ease: ["easeOut", "easeOut", "easeOut", "linear", "easeIn"] },
          ),
          animate(
            "[data-part=pole]",
            { scaleY: [1, 1, 0.96, 1, 1, 0.98, 1, 1] },
            { duration: seconds, times: [0, 0.3, 0.38, 0.48, 0.72, 0.78, 0.86, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=insulator]",
            { rotate: [0, 0, 10, -6, 0, 0] },
            { duration: seconds, times: [0, 0.3, 0.4, 0.5, 0.6, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      {/* a faceted bird, beak left and tail up: it only exists in motion, landing on the middle of the arm */}
      <path
        data-part="bird"
        d="M10 4.5 11.5 3l1 1 1.5-1-.5 2-1.5 1-1.5-.5z"
        fill={slot.accent}
        stroke="none"
        style={flash("50% 100%")}
      />
      <g stroke={slot.accent}>
        <path data-part="zap" d="M4 11 3 13" style={flash("100% 0%")} />
        <path data-part="zap" d="M20 11l1 2" style={flash("0% 0%")} />
      </g>
      <g data-part="pole" style={pivot("50% 100%")}>
        {/* the pole, with two braces from the arm down to it */}
        <path d="M12 7v14M7 7l5 5M17 7l-5 5" />
        <g data-part="arm" style={pivot("50% 100%")}>
          {/* insulators first, so the arm paints over their feet */}
          <g stroke={slot.accent}>
            {INSULATORS.map((x) => (
              <path key={x} data-part="insulator" d={`M${x} 7V4`} style={pivot("50% 100%")} />
            ))}
          </g>
          <path d="M3 7h18" />
        </g>
      </g>
    </>
  ),
})
