"use client";

import { stagger } from "motion/react";

import { createAnimatedIcon } from "../lib/create-icon";
import { ease, pivot, slot } from "../lib/motion";

declare module "../lib/types" {
  interface IconVariants {
    footprints: "walk" | "march" | "tiptoe";
  }
}

/**
 * Two prints, the left one behind and the right one a step ahead: a faceted sole with a heel bar
 * beneath it, listed in the order they step.
 */
const PRINTS = [
  { sole: "M4 3h4l1 4-.5 5h-4L3 7Z", heel: "M4.5 16h4", stroke: slot.primary },
  {
    sole: "M16 7h4l1 4-.5 5h-4L15 11Z",
    heel: "M15.5 20h4",
    stroke: slot.accent,
  },
];

/** 2 colors: back print (primary), front print (accent). */
export const Footprints = createAnimatedIcon({
  name: "footprints",
  category: "navigation",
  keywords: [
    "steps",
    "walk",
    "tracks",
    "trail",
    "path",
    "barefoot",
    "journey",
    "progress",
  ],
  slots: { primary: "back print", accent: "front print" },
  defaultVariant: "walk",
  variants: {
    // each foot lifts toward you, then stamps down flat with a squash, one after the other
    walk: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=print]",
          {
            scale: [1, 1.3, 0.85, 1.05, 1],
            y: [0, -2, 0, 0, 0],
            opacity: [1, 0.55, 1, 1, 1],
          },
          {
            duration: seconds * 0.6,
            times: [0, 0.35, 0.6, 0.8, 1],
            delay: stagger(seconds * 0.4),
            ease: ["easeOut", ease.in, "easeOut", "easeInOut"],
          },
        ),
    },
    // the prints step off the top one after the other and fresh ones walk in from below
    march: {
      clip: true,
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=print]",
          { y: [0, -8, 8, 0], opacity: [1, 0, 0, 1] },
          {
            duration: seconds * 0.7,
            times: [0, 0.45, 0.5, 1],
            delay: stagger(seconds * 0.3),
            ease: [ease.in, "linear", ease.out],
          },
        ),
    },
    // each foot rolls up onto its toes: the sole foreshortens toward the toes and the heel lifts
    // away in depth, then it rolls back down
    tiptoe: {
      duration: 1100,
      run: ({ animate, seconds }) => {
        const options = {
          duration: seconds * 0.6,
          times: [0, 0.45, 0.8, 1],
          delay: stagger(seconds * 0.4),
          ease: "easeInOut" as const,
        };
        return Promise.all([
          animate(
            "[data-part=sole]",
            { scaleY: [1, 0.78, 1.05, 1], skewX: [0, -6, 2, 0] },
            options,
          ),
          animate(
            "[data-part=heel]",
            {
              y: [0, -2, 0.5, 0],
              scaleX: [1, 0.5, 1.1, 1],
              opacity: [1, 0.3, 1, 1],
            },
            options,
          ),
        ]);
      },
    },
  },
  render: () => (
    <>
      {PRINTS.map(({ sole, heel, stroke }) => (
        <g
          key={sole}
          data-part="print"
          stroke={stroke}
          style={pivot("50% 50%")}
        >
          <path data-part="sole" d={sole} style={pivot("50% 0%")} />
          <path data-part="heel" d={heel} style={pivot("50% 50%")} />
        </g>
      ))}
    </>
  ),
});
