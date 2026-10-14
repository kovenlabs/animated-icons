"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "tent-tree": "pitch" | "breeze" | "morning"
  }
}

/** 3 colors: tent and ground (primary), pine (secondary), sun and doorway (accent). */
export const TentTree = createAnimatedIcon({
  name: "tent-tree",
  family: "tent",
  category: "nature",
  keywords: ["camping", "campsite", "outdoors", "forest", "hiking", "nature", "holiday", "glamping"],
  slots: { primary: "tent + ground", secondary: "pine", accent: "sun + doorway" },
  defaultVariant: "pitch",
  variants: {
    // the tent springs up off the ground and overshoots tall, the pine pops up behind it with a wiggle,
    // and the sun climbs into the sky
    pitch: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=tent]",
            { scaleY: [0, 1.15, 0.9, 1.04, 1], scaleX: [1, 0.92, 1.05, 0.99, 1] },
            { duration: seconds * 0.55, times: [0, 0.4, 0.62, 0.82, 1], ease: [ease.out, "easeInOut", "easeInOut", "easeInOut"] },
          ),
          animate(
            "[data-part=pine]",
            { scale: [0, 0, 1.08, 0.95, 1], rotate: [0, 0, -8, 4, 0] },
            { duration: seconds, times: [0, 0.38, 0.6, 0.8, 1], ease: ["linear", ease.out, "easeInOut", "easeInOut"] },
          ),
          animate(
            "[data-part=sun]",
            { y: [4, 4, -0.6, 0], opacity: [0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.5, 0.82, 1], ease: ["linear", ease.out, "easeInOut"] },
          ),
        ]),
    },
    // the wind gets up: the pine bends hard over, its top branches lashing a beat behind, the doorway
    // flaps, and the sun drifts the other way, far off behind it all
    breeze: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=pine]",
            { skewX: [0, -12, 9, -5, 2, 0] },
            { duration: seconds, times: [0, 0.22, 0.46, 0.66, 0.84, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=crown]",
            { rotate: [0, 0, -10, 8, -3, 0] },
            { duration: seconds, times: [0, 0.12, 0.34, 0.56, 0.78, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=door]",
            { scaleX: [1, 0.4, 1, 0.6, 1], skewX: [0, -10, 0, -6, 0] },
            { duration: seconds, times: [0, 0.25, 0.5, 0.72, 1], ease: "easeInOut" },
          ),
          animate("[data-part=sun]", { x: [0, 1.2, -0.6, 0] }, { duration: seconds, ease: "easeInOut" }),
        ]),
    },
    // sunrise: the sun swells and beams, the doorway is pulled open as the camper looks out, and the
    // pine crouches and shakes itself awake
    morning: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=sun]",
            { scale: [1, 0.6, 1.25, 0.95, 1] },
            { duration: seconds * 0.7, times: [0, 0.25, 0.55, 0.8, 1], ease: ["easeIn", ease.out, "easeInOut", "easeInOut"] },
          ),
          animate(
            "[data-part=door]",
            { scaleX: [1, 1, 0, 0, 1.1, 1] },
            { duration: seconds, times: [0, 0.3, 0.45, 0.7, 0.86, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=pine]",
            { rotate: [0, 0, 0, -8, 5, 0], scaleY: [1, 1, 0.85, 1.04, 0.97, 1] },
            { duration: seconds, times: [0, 0.4, 0.5, 0.64, 0.8, 1], ease: ["linear", "easeOut", ease.out, "easeInOut", "easeOut"] },
          ),
        ]),
    },
  },
  render: () => (
    <>
      <circle data-part="sun" cx="5" cy="5.5" r="2" stroke={slot.accent} style={pivot("50% 50%")} />
      {/* the pine stands just behind the tent, its trunk ending on the tent's back corner */}
      <g data-part="pine" stroke={slot.secondary} style={pivot("50% 100%")}>
        {/* the top tier and the trunk above the lower one whip on the lower tier's peak */}
        <g data-part="crown" style={pivot("50% 100%")}>
          <path d="M16 8V3" />
          <path d="M13 5l3-2 3 2" />
        </g>
        <path d="M16 14V8" />
        <path d="M13 10l3-2 3 2" />
      </g>
      {/* a ridge tent seen from the front corner, standing on the ground line */}
      <g data-part="tent" style={pivot("50% 100%")}>
        <path d="M2 21l5-7h9l5 7ZM7 14l5 7" />
        {/* the doorway: a wedge hanging from the front peak */}
        <path data-part="door" d="M7 14l1.5 7h-3Z" fill={slot.accent} stroke="none" style={pivot("50% 0%")} />
      </g>
    </>
  ),
})
