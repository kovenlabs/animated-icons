"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    warehouse: "roll" | "turn" | "thud"
  }
}

/** The roller door's slats, top to bottom, with how far each rolls up to vanish into the lintel at y 12. */
const SLATS = [
  { y: 16, rise: 4 },
  { y: 20, rise: 8 },
] as const

/** 2 colors: shed and door frame (primary), roller door and crate (accent). */
export const Warehouse = createAnimatedIcon({
  name: "warehouse",
  category: "commerce",
  keywords: ["storage", "depot", "inventory", "stock", "logistics", "distribution", "shed", "fulfillment"],
  slots: { primary: "shed + door frame", accent: "roller door + crate" },
  defaultVariant: "roll",
  variants: {
    // the roller door rolls up into its lintel, a crate rolls out toward you and back into the dark, and the door
    // comes down again with a bounce
    roll: {
      clip: false,
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          ...SLATS.map(({ rise }, i) =>
            animate(
              `[data-part=slat]:nth-of-type(${i + 1})`,
              { y: [0, -rise, -rise, 0.6, 0], opacity: [1, 0, 0, 1, 1] },
              {
                duration: seconds,
                times: [0, 0.28, 0.72, 0.9, 1],
                ease: ["easeInOut", "linear", ease.in, "easeOut"],
              },
            ),
          ),
          animate(
            "[data-part=crate]",
            { opacity: [0, 0, 1, 1, 0, 0], scale: [0.5, 0.5, 1.15, 1, 0.6, 0.6] },
            { duration: seconds, times: [0, 0.24, 0.42, 0.54, 0.68, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the shed swivels one way and the other; the recessed door slides against the walls like a nearer plane
    turn: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=warehouse]",
            { scaleX: [1, 0.6, 1, 0.6, 1], skewY: [0, -8, 0, 8, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate("[data-part=bay]", { x: [0, 1, 0, -1, 0] }, { duration: seconds, ease: "easeInOut" }),
        ]),
    },
    // a heavy load lands inside: the shed lifts, slams down into a squash, and the door slats rattle after it
    thud: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=warehouse]",
            { y: [0, -1, 0, 0, 0], scaleY: [1, 1.04, 0.86, 1.03, 1], scaleX: [1, 0.97, 1.05, 0.99, 1] },
            { duration: seconds, times: [0, 0.3, 0.5, 0.75, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=slat]",
            { y: [0, 0, 1, -0.5, 0.3, 0] },
            { duration: seconds, times: [0, 0.5, 0.62, 0.74, 0.86, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="warehouse" style={pivot("50% 100%")}>
      {/* a wide, low-pitched shed with no floor line, like a loading bay open to the yard */}
      <path d="M3 22V9l9-5 9 5v13" />
      <g data-part="bay">
        {/* the crate waits in the dark behind the door, 2px clear of the frame */}
        <rect
          data-part="crate"
          x="10"
          y="17"
          width="4"
          height="4"
          fill={slot.accent}
          stroke="none"
          style={flash("50% 100%")}
        />
        <g stroke={slot.accent}>
          {SLATS.map(({ y }) => (
            <path key={y} data-part="slat" d={`M7 ${y}h10`} />
          ))}
        </g>
        {/* the frame last, so it paints over the slats' ends */}
        <path d="M7 22V12h10v10" />
      </g>
    </g>
  ),
})
