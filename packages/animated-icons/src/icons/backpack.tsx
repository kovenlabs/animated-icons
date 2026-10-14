"use client";

import { createAnimatedIcon } from "../lib/create-icon";
import { pivot, slot } from "../lib/motion";

declare module "../lib/types" {
  interface IconVariants {
    backpack: "hop" | "turn" | "zip";
  }
}

/** 2 colors: pack and handle (primary), pocket and zip (accent). */
export const Backpack = createAnimatedIcon({
  name: "backpack",
  category: "commerce",
  keywords: [
    "rucksack",
    "bag",
    "school",
    "travel",
    "hiking",
    "luggage",
    "knapsack",
    "daypack",
  ],
  slots: { primary: "pack + handle", accent: "pocket + zip" },
  defaultVariant: "hop",
  variants: {
    // hitched up on the back: it crouches, bounces up stretched and lands squashed, the pocket and
    // handle springing a beat behind
    hop: {
      duration: 900,
      run: ({ animate, seconds }) => {
        const options = {
          duration: seconds,
          times: [0, 0.18, 0.45, 0.7, 1],
          ease: "easeInOut" as const,
        };
        return Promise.all([
          animate(
            "[data-part=pack]",
            {
              y: [0, 1, -1, 0, 0],
              scaleY: [1, 0.88, 1.04, 0.85, 1],
              scaleX: [1, 1.08, 0.94, 1.12, 1],
            },
            options,
          ),
          animate(
            "[data-part=pocket]",
            { scaleY: [1, 1, 0.8, 1.2, 1] },
            options,
          ),
          animate(
            "[data-part=handle]",
            { scaleY: [1, 0.7, 1, 1.25, 1] },
            options,
          ),
        ]);
      },
    },
    // turns side to side in perspective: the pack narrows, the pocket in front slides furthest, the
    // handle on top drifts the other way
    turn: {
      duration: 1300,
      run: ({ animate, seconds }) => {
        const options = { duration: seconds, ease: "easeInOut" as const };
        return Promise.all([
          animate("[data-part=pack]", { scaleX: [1, 0.6, 1, 0.6, 1] }, options),
          animate("[data-part=pocket]", { x: [0, -1, 0, 1, 0], scaleX: [1, 0.7, 1, 0.7, 1] }, options),
          animate("[data-part=zip]", { x: [0, -1, 0, 1, 0] }, options),
          animate("[data-part=handle]", { x: [0, 1, 0, -1, 0] }, options),
        ]);
      },
    },
    // zipped shut: the zip runs across the flap and the pack bulges full, then settles
    zip: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=zip]",
            { opacity: [1, 0, 0, 1] },
            {
              duration: seconds * 0.45,
              times: [0, 0.3, 0.45, 1],
              ease: "easeOut",
            },
          ),
          animate(
            "[data-part=zip]",
            { pathLength: [1, 1, 0, 1] },
            {
              duration: seconds * 0.75,
              times: [0, 0.18, 0.2, 1],
              ease: "easeOut",
            },
          ),
          animate(
            "[data-part=pack]",
            { scaleX: [1, 1, 1.14, 0.95, 1], scaleY: [1, 1, 0.94, 1.03, 1] },
            {
              duration: seconds,
              times: [0, 0.65, 0.78, 0.9, 1],
              ease: "easeOut",
            },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="pack" style={pivot("50% 100%")}>
      {/* a grab loop on top of a tall pack with chamfered shoulders */}
      <path data-part="handle" d="M10 5V3h4v2" style={pivot("50% 100%")} />
      <path d="M5 7l2-2h10l2 2v14H5Z" />
      <g stroke={slot.accent}>
        <path data-part="zip" d="M8 10h8" style={pivot("0% 50%")} />
        {/* a front pocket standing on the base */}
        <path data-part="pocket" d="M8 21v-5h8v5" style={pivot("50% 100%")} />
      </g>
    </g>
  ),
});
