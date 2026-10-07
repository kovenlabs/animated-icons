"use client"

import type { Easing } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    ghost: "float" | "boo" | "turn"
  }
}

/** 2 colors: sheet (primary), eyes (accent). */
export const Ghost = createAnimatedIcon({
  name: "ghost",
  category: "gaming",
  keywords: ["halloween", "spooky", "phantom", "spirit", "boo", "haunted", "scary", "pac-man"],
  slots: { primary: "sheet", accent: "eyes" },
  defaultVariant: "float",
  variants: {
    // drifts off into the distance, shrinking and fading as it sways away, then swoops back towards
    // you, overshoots, and blinks
    float: {
      clip: false,
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=ghost]",
            {
              scale: [1, 0.55, 0.55, 1.15, 1],
              opacity: [1, 0.25, 0.25, 1, 1],
              x: [0, 3, -2, 0, 0],
              y: [0, -3, -3, 0.5, 0],
              rotate: [0, 10, -8, -2, 0],
            },
            { duration: seconds * 0.85, times: [0, 0.35, 0.55, 0.8, 1], ease: ["easeInOut", "easeInOut", ease.out, "easeInOut"] },
          ),
          animate(
            "[data-part=eye]",
            { scaleY: [1, 1, 0.1, 1] },
            { duration: seconds, times: [0, 0.82, 0.9, 1], ease: ["linear", "easeIn", "easeOut"] },
          ),
        ]),
    },
    // boo! it ducks down, then lunges at you, big and wide-eyed, and drifts back
    boo: {
      duration: 1000,
      run: ({ animate, seconds }) => {
        const timing = { duration: seconds, times: [0, 0.25, 0.45, 0.65, 1], ease: ["easeOut", ease.out, "linear", "easeInOut"] satisfies Easing[] }
        return Promise.all([
          animate("[data-part=ghost]", { scale: [1, 0.95, 1.35, 1.35, 1], y: [0, 0, -1, -1, 0] }, timing),
          animate("[data-part=body]", { scaleY: [1, 0.82, 1.06, 1, 1], scaleX: [1, 1.12, 0.95, 1, 1] }, timing),
          animate("[data-part=eye]", { scale: [1, 0.6, 1.5, 1.5, 1] }, timing),
        ])
      },
    },
    // turns round in mid air: the sheet narrows to edge-on, shows its blank back, and comes round again
    turn: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=body]",
            { scaleX: [1, 0, -1, 0, 1] },
            { duration: seconds, ease: ["easeIn", "easeOut", "easeIn", "easeOut"] },
          ),
          animate(
            "[data-part=eye]",
            { opacity: [1, 1, 0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.25, 0.251, 0.75, 0.751, 1], ease: ["linear", snap, "linear", snap, "linear"] },
          ),
          animate("[data-part=ghost]", { y: [0, -2, 0] }, { duration: seconds, ease: "easeInOut" }),
        ]),
    },
  },
  render: () => (
    <g data-part="ghost" style={pivot("50% 50%")}>
      <g data-part="body" style={pivot("50% 100%")}>
        {/* a round head (a true arc), straight sides, and a hem cut into three points */}
        <path d="M4 21V10a8 8 0 0 1 16 0v11l-4-3-4 3-4-3z" />
        <g fill={slot.accent} stroke="none">
          <rect data-part="eye" x="8" y="9" width="2" height="3" style={pivot("50% 50%")} />
          <rect data-part="eye" x="14" y="9" width="2" height="3" style={pivot("50% 50%")} />
        </g>
      </g>
    </g>
  ),
})
