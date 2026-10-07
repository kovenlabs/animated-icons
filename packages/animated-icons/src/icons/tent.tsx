"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    tent: "open" | "pitch" | "gust"
  }
}

/** How far each door edge leans off vertical: the door runs from (12, 12.5) down to 7.5 and 16.5. */
const HINGE = (Math.atan2(4.5, 8.5) * 180) / Math.PI

/** 2 colors: tent and ground (primary), door flaps (accent). */
export const Tent = createAnimatedIcon({
  name: "tent",
  category: "nature",
  keywords: ["camping", "camp", "campsite", "outdoors", "shelter", "hiking", "glamping", "festival"],
  slots: { primary: "tent + ground", accent: "door flaps" },
  defaultVariant: "open",
  variants: {
    // the two door flaps swing out toward you and fold back on their hinges, hold, then fall shut with a
    // flap. Folded back, each stops well short of the wall
    open: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=flap]",
            { scaleX: [1, -0.45, -0.45, 1.1, 0.96, 1] },
            { duration: seconds, times: [0, 0.3, 0.6, 0.8, 0.9, 1], ease: [ease.inOut, "linear", "easeIn", "easeOut", "easeInOut"] },
          ),
          animate(
            "[data-part=tent]",
            { scaleY: [1, 1, 1, 0.94, 1.02, 1] },
            { duration: seconds, times: [0, 0.3, 0.75, 0.82, 0.92, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the tent collapses flat and springs up taut past its height, then the door pops into place
    pitch: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=tent]",
            { scaleY: [1, 0.1, 0.1, 1.18, 0.94, 1], scaleX: [1, 1.12, 1.12, 0.94, 1.02, 1] },
            { duration: seconds, times: [0, 0.16, 0.26, 0.56, 0.76, 1], ease: [ease.in, "linear", ease.out, "easeInOut", "easeInOut"] },
          ),
          animate(
            "[data-part=door]",
            { scale: [1, 1, 0, 0, 1.3, 1] },
            { duration: seconds, times: [0, 0.16, 0.17, 0.5, 0.78, 1], ease: ["linear", "linear", "linear", ease.out, "easeInOut"] },
          ),
        ]),
    },
    // a gust leans the tent over on its pegs, and the flaps billow, a beat behind
    gust: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=tent]", { skewX: [0, -12, 8, -4, 1.5, 0] }, { duration: seconds, ease: "easeInOut" }),
          animate(
            "[data-part=flap]",
            { scaleX: [1, 0.55, 1, 0.75, 1] },
            { duration: seconds, times: [0, 0.3, 0.55, 0.75, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      <path d="M2 21h20" />
      {/* stands on its pegs: everything moves from the middle of its base */}
      <g data-part="tent" style={pivot("50% 100%")}>
        {/* two poles crossing just below their tips */}
        <path d="M3 21 13 3M21 21 11 3" />
        {/* the doorway: a solid triangle split into two flaps, each hinged on its sloping outer edge. Each
            flap is drawn turned upright about its hinge's foot (so it folds with a plain scaleX) and
            turned back into place by its wrapper */}
        <g data-part="door" fill={slot.accent} stroke="none" style={pivot("50% 100%")}>
          <g transform={`rotate(${HINGE} 7.5 21)`}>
            <path data-part="flap" d="M7.5 21V11.38l3.98 7.52z" style={pivot("0% 50%")} />
          </g>
          <g transform={`rotate(${-HINGE} 16.5 21)`}>
            <path data-part="flap" d="M16.5 21V11.38l-3.98 7.52z" style={pivot("100% 50%")} />
          </g>
        </g>
      </g>
    </>
  ),
})
