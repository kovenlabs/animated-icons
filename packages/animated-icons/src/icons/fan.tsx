"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    fan: "spin" | "oscillate" | "turbo"
  }
}

/** Three faceted blades around the hub at (12, 10), a quarter-turn apart from the cage's top. */
const BLADES = [
  "M12 10L10.12 4.83L13.88 4.83Z",
  "M12 10L17.42 10.96L15.54 14.21Z",
  "M12 10L8.46 14.21L6.58 10.96Z",
]

/** The hub sits off-centre in the blades' box: spin on it, not on the box. */
const HUB = pivot("50% 55.12%")

/** 2 colors: cage and stand (primary), blades (accent). */
export const Fan = createAnimatedIcon({
  name: "fan",
  category: "home",
  keywords: ["cooling", "air", "breeze", "ventilation", "desk fan", "air conditioning", "blower"],
  slots: { primary: "cage + stand", accent: "blades" },
  defaultVariant: "spin",
  variants: {
    // the blades spin up, whirl two turns and coast to a stop
    spin: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        animate("[data-part=blades]", { rotate: [0, 720] }, { duration: seconds, ease: ease.inOut }),
    },
    // the head turns from side to side on its neck, foreshortening as it faces away, blades whirling
    oscillate: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=head]",
            {
              scaleX: [1, 0.7, 1, 0.7, 1],
              x: [0, -1.5, 0, 1.5, 0],
              skewY: [0, 8, 0, -8, 0],
            },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate("[data-part=blades]", { rotate: [0, 720] }, { duration: seconds, ease: ease.inOut }),
        ]),
    },
    // full power: the blades blur through three turns, the cage swells and the fan shudders on its
    // base. The cage already runs to 1px from the top edge, so it swells about its own centre and the
    // shudder only rattles it down and sideways, never up out of the frame
    turbo: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=blades]", { rotate: [0, 1080] }, { duration: seconds, ease: ease.inOut }),
          animate(
            "[data-part=head]",
            { scale: [1, 0.92, 1.06, 1.03, 1.06, 1] },
            { duration: seconds, times: [0, 0.15, 0.35, 0.55, 0.75, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=fan]",
            {
              y: [0, 0, -0.4, 0, -0.4, 0, 0],
              rotate: [0, -3, 3, -3, 3, -1.5, 0],
              scaleY: [1, 0.93, 1, 0.95, 1, 0.97, 1],
            },
            { duration: seconds, ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="fan" style={pivot("50% 100%")}>
      <path d="M12 18v3M7 21h10" />
      <g data-part="head" style={pivot("50% 50%")}>
        <circle cx="12" cy="10" r="8" />
        <g data-part="blades" fill={slot.accent} stroke="none" style={HUB}>
          {BLADES.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
      </g>
    </g>
  ),
})
