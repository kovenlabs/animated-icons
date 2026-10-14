"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    castle: "wave" | "rise" | "open"
  }
}

/** 2 colors: walls and towers (primary), flag and gate (accent). */
export const Castle = createAnimatedIcon({
  name: "castle",
  category: "buildings",
  keywords: ["fortress", "kingdom", "palace", "fort", "medieval", "chess", "tower", "fantasy"],
  slots: { primary: "walls + towers", accent: "flag + gate" },
  defaultVariant: "wave",
  variants: {
    // the pennant streams out in a gust and snaps back, rippling from the pole to its tip
    wave: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=flag]",
          { skewY: [0, -16, 12, -7, 3, 0], scaleX: [1, 0.78, 1.15, 0.92, 1.04, 1] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    // the castle builds itself up from the ground: the keep shoots up first, the towers follow, and the
    // flag pops out on top
    rise: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=keep]",
            { scaleY: [0, 1.05, 0.95, 1] },
            { duration: seconds * 0.55, times: [0, 0.6, 0.8, 1], ease: ["easeOut", "easeInOut", "easeInOut"] },
          ),
          animate(
            "[data-part=tower]",
            { scaleY: [0, 0, 1.15, 0.95, 1] },
            { duration: seconds * 0.7, times: [0, 0.25, 0.65, 0.85, 1], ease: ["linear", "easeOut", "easeInOut", "easeInOut"] },
          ),
          animate(
            "[data-part=flag]",
            { scale: [0, 0, 1.3, 1], rotate: [0, 0, -12, 0] },
            { duration: seconds, times: [0, 0.5, 0.8, 1], ease: ["linear", ease.overshoot, "easeInOut"] },
          ),
        ]),
    },
    // the gate swings inward on its hinge, foreshortening as it turns away from you, then shuts with a jolt
    open: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=gate]",
            { scaleX: [1, 0.15, 0.15, 1, 1], skewY: [0, -22, -22, 0, 0] },
            { duration: seconds, times: [0, 0.3, 0.55, 0.8, 1], ease: [ease.out, "linear", ease.in, "linear"] },
          ),
          animate(
            "[data-part=castle]",
            { scaleY: [1, 1, 0.93, 1], scaleX: [1, 1, 1.03, 1] },
            { duration: seconds, times: [0, 0.8, 0.88, 1], ease: ["linear", "easeOut", "easeInOut"] },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="castle" style={pivot("50% 100%")}>
      {/* two turrets with pointed roofs, joined by low walls to a square keep */}
      <path data-part="tower" d="M8 12H6V8L4 5 2 8v13h6" style={pivot("50% 100%")} />
      <path data-part="tower" d="M16 12h2V8l2-3 2 3v13h-6" style={pivot("50% 100%")} />
      <g data-part="keep" style={pivot("50% 100%")}>
        <path d="M8 21V6h8v15M12 6V2" />
        {/* a pointed gate and a swallow-tailed pennant, solid */}
        <g fill={slot.accent} stroke="none">
          <path data-part="gate" d="M10 21v-4l2-2 2 2v4Z" style={pivot("0% 100%")} />
          <path data-part="flag" d="M12 2h4.5l-1.25 1.5L16.5 5H12Z" style={pivot("0% 50%")} />
        </g>
      </g>
    </g>
  ),
})
