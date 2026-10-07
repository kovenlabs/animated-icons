"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    landmark: "build" | "turn" | "approach"
  }
}

/** Four columns, 4 apart, standing free: 4 below the roof's base and 4 above the ground. */
const COLUMNS = [6, 10, 14, 18] as const

/** 2 colors: roof and ground (primary), columns (accent). */
export const Landmark = createAnimatedIcon({
  name: "landmark",
  category: "finance",
  keywords: ["bank", "government", "institution", "museum", "court", "capitol", "building", "public"],
  slots: { primary: "roof + ground", accent: "columns" },
  defaultVariant: "build",
  variants: {
    // the roof lifts off as the columns sink into the ground; they rise again one by one, overshooting,
    // and the roof drops back onto them
    build: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=roof]",
            { y: [0, -3.5, -3.5, 0.6, 0], rotate: [0, -6, -6, 0, 0] },
            { duration: seconds, times: [0, 0.2, 0.74, 0.86, 1], ease: ["easeOut", "linear", ease.in, "easeOut"] },
          ),
          animate(
            "[data-part=column]",
            { scaleY: [1, 0, 0, 1.15, 1, 1] },
            {
              duration: seconds,
              times: [0, 0.2, 0.28, 0.44, 0.56, 1],
              delay: (i: number) => i * seconds * 0.07,
              ease: ["easeIn", "linear", "easeOut", "easeInOut", "linear"],
            },
          ),
        ]),
    },
    // the facade swivels to one side and the other; the columns stand in front, so they slide further
    turn: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=landmark]",
            { scaleX: [1, 0.6, 1, 0.6, 1], skewY: [0, -10, 0, 10, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate("[data-part=columns]", { x: [0, 1.5, 0, -1.5, 0] }, { duration: seconds, ease: "easeInOut" }),
        ]),
    },
    // the bank looms toward you from its ground line and settles back; the roof lifts a beat late
    approach: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=landmark]",
            { scale: [1, 1.2, 0.95, 1] },
            { duration: seconds, times: [0, 0.4, 0.7, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=roof]",
            { y: [0, 0, -1.5, 0.6, 0] },
            { duration: seconds, times: [0, 0.25, 0.5, 0.75, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="landmark" style={pivot("50% 100%")}>
      {/* a low pediment: a triangle over the full width */}
      <path data-part="roof" d="M12 2l9 5H3z" style={pivot("0% 100%")} />
      <g data-part="columns" stroke={slot.accent}>
        {COLUMNS.map((x) => (
          <path key={x} data-part="column" d={`M${x} 11v7`} style={pivot("50% 100%")} />
        ))}
      </g>
      <path d="M3 22h18" />
    </g>
  ),
})
