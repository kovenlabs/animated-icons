"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    fuel: "pump" | "spin" | "whip"
  }
}

/** 2 colors: pump and base (primary), gauge, hose and nozzle (accent). */
export const Fuel = createAnimatedIcon({
  name: "fuel",
  category: "transport",
  keywords: ["gas station", "petrol", "gasoline", "diesel", "refuel", "fill up", "pump", "energy"],
  slots: { primary: "pump + base", accent: "gauge + hose + nozzle" },
  defaultVariant: "pump",
  variants: {
    // the gauge runs empty, then fills back up in three glugs, the pump heaving and the nozzle kicking
    // with each one
    pump: {
      duration: 1300,
      run: ({ animate, seconds }) => {
        const times = [0, 0.2, 0.45, 0.7, 1]
        return Promise.all([
          animate(
            "[data-part=gauge]",
            { scaleX: [1, 0, 0.35, 0.7, 1] },
            { duration: seconds, times, ease: ["easeInOut", ease.overshoot, ease.overshoot, ease.overshoot] },
          ),
          animate(
            "[data-part=pump]",
            { scaleY: [1, 1, 1.07, 0.96, 1.07, 0.96, 1.07, 1], scaleX: [1, 1, 0.96, 1.03, 0.96, 1.03, 0.96, 1] },
            { duration: seconds, times: [0, 0.2, 0.3, 0.45, 0.55, 0.7, 0.8, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=nozzle]",
            { rotate: [0, 0, -20, 0, -20, 0, -20, 0] },
            { duration: seconds, times: [0, 0.2, 0.3, 0.45, 0.55, 0.7, 0.8, 1], ease: "easeInOut" },
          ),
        ])
      },
    },
    // hops and turns right round on its base like a turntable, landing with a squash
    spin: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=station]",
          {
            scaleX: [1, 1, 0, -1, 0, 1, 1.08, 1],
            scaleY: [1, 0.92, 1, 1, 1, 1, 0.9, 1],
            y: [0, 0, -2.5, -3, -2.5, 0, 0, 0],
          },
          { duration: seconds, times: [0, 0.1, 0.3, 0.45, 0.6, 0.78, 0.88, 1], ease: "easeInOut" },
        ),
    },
    // the hose is yanked: it whips up and down off the pump, the nozzle flailing a beat behind
    whip: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=hose]",
            { skewY: [0, -28, 20, -10, 4, 0], scaleX: [1, 0.88, 1.05, 0.98, 1, 1] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=nozzle]",
            { rotate: [0, 0, 45, -35, 15, -5, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="station" style={pivot("50% 100%")}>
      <g data-part="pump" style={pivot("50% 100%")}>
        {/* a tall cabinet on a base, its display set off by a rule */}
        <path d="M3 21V3h11v18M2 21h14M3 11h11" />
        <rect data-part="gauge" x="6" y="6" width="5" height="2" fill={slot.accent} stroke="none" style={pivot("0% 50%")} />
      </g>
      {/* the hose leaves the cabinet, loops down and up its side to the nozzle hung on top */}
      <g data-part="hose" stroke={slot.accent} style={pivot("0% 50%")}>
        <path d="M14 14h4v5h4V9" />
        <path data-part="nozzle" d="M22 9l-3-3" style={pivot("100% 100%")} />
      </g>
    </g>
  ),
})
