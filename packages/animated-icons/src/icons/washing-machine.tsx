"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "washing-machine": "wash" | "spin" | "done"
  }
}

/** 2 colors: cabinet and drum (primary), water and dial (accent). */
export const WashingMachine = createAnimatedIcon({
  name: "washing-machine",
  category: "home",
  keywords: ["washer", "laundry", "clothes", "appliance", "wash", "laundromat", "spin cycle"],
  slots: { primary: "cabinet + drum", accent: "water + dial" },
  defaultVariant: "wash",
  variants: {
    // the water sloshes round the drum one way and the other, the cabinet rocking against it
    wash: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=water]",
            { rotate: [0, -55, 45, -30, 15, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=machine]",
            { rotate: [0, 3, -3, 2, -1, 0] },
            { duration: seconds, delay: seconds * 0.05, ease: "easeInOut" },
          ),
          animate("[data-part=dial]", { rotate: [0, 90, 0] }, { duration: seconds * 0.4, ease: "easeInOut" }),
        ]),
    },
    // spin cycle: the load whips round twice and the whole machine shudders and hops on the floor
    spin: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=water]", { rotate: [0, 720] }, { duration: seconds, ease: ease.inOut }),
          animate(
            "[data-part=machine]",
            {
              x: [0, -0.8, 0.8, -0.8, 0.8, -0.8, 0.8, 0],
              y: [0, -1, 0, -1, 0, -1, 0, 0],
              skewX: [0, -4, 4, -4, 4, -4, 4, 0],
            },
            { duration: seconds, times: [0, 0.2, 0.32, 0.44, 0.56, 0.68, 0.8, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // cycle finished: the machine squashes down and springs up, the dial pops and the water settles
    done: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=machine]",
            { scaleY: [1, 0.86, 1.08, 0.96, 1], scaleX: [1, 1.08, 0.95, 1.02, 1] },
            { duration: seconds * 0.8, times: [0, 0.25, 0.55, 0.8, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=water]",
            { rotate: [0, 0, 25, -15, 6, 0] },
            { duration: seconds, times: [0, 0.25, 0.45, 0.65, 0.85, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=dial]",
            { scale: [1, 1, 1.6, 1] },
            { duration: seconds * 0.7, times: [0, 0.45, 0.7, 1], ease: ease.overshoot },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="machine" style={pivot("50% 100%")}>
      {/* the cabinet with a control strip along the top */}
      <path d="M3 2h18v20H3ZM3 6h18" />
      <rect data-part="dial" x="16" y="3" width="2" height="2" fill={slot.accent} stroke="none" style={pivot("50% 50%")} />
      <circle cx="12" cy="14" r="5" />
      {/* the water fills the lower half of the drum, faceted along its inner wall; it turns about the drum's centre */}
      <path
        data-part="water"
        d="M16 14 15.46 16 14 17.46 12 18 10 17.46 8.54 16 8 14Z"
        fill={slot.accent}
        stroke="none"
        style={pivot("50% 0%")}
      />
    </g>
  ),
})
