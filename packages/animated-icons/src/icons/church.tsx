"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    church: "toll" | "vane" | "open"
  }
}

/** A peal blinking in twice and out, each wave growing outward from the steeple. */
const peal = { opacity: [0, 1, 0, 1, 0], scale: [0.5, 1, 1.15, 1, 1.25] }

/** 2 colors: church (primary), cross, bell and door (accent). */
export const Church = createAnimatedIcon({
  name: "church",
  category: "buildings",
  keywords: ["chapel", "cathedral", "steeple", "worship", "religion", "wedding", "parish", "faith"],
  slots: { primary: "church", accent: "cross + bell + door" },
  defaultVariant: "toll",
  variants: {
    // the bell swings hard in the belfry, the whole church rocks with it and the peal rings out both sides
    toll: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=bell]",
            { rotate: [0, 20, -20, 14, -8, 3, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=church]",
            { rotate: [0, -2.5, 2.5, -1.5, 0.8, 0] },
            { duration: seconds * 0.95, delay: seconds * 0.05, ease: "easeInOut" },
          ),
          animate("[data-part=wave]", peal, { duration: seconds * 0.8, delay: seconds * 0.12, ease: "easeOut" }),
        ]),
    },
    // the cross turns twice on the spire like a weather vane, edge-on and back, as the church crouches and the bell dings
    vane: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=cross]",
            { scaleX: [1, 0, -1, 0, 1, 0, -1, 0, 1] },
            { duration: seconds * 0.85, ease: "easeInOut" },
          ),
          animate(
            "[data-part=church]",
            { scaleY: [1, 0.92, 1, 1], scaleX: [1, 1.04, 1, 1] },
            { duration: seconds, times: [0, 0.2, 0.45, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=bell]",
            { rotate: [0, 0, 16, -12, 6, 0] },
            { duration: seconds, times: [0, 0.6, 0.7, 0.8, 0.9, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the door swings out toward you on its hinge, the bell bobs a welcome, and the door shuts again
    open: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=door]",
            { scaleX: [1, 0.2, 0.2, 1], skewY: [0, -16, -16, 0] },
            { duration: seconds, times: [0, 0.3, 0.7, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=bell]",
            { scale: [1, 1, 1.3, 0.9, 1], rotate: [0, 0, -14, 10, 0] },
            { duration: seconds * 0.85, times: [0, 0.3, 0.53, 0.76, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      {/* the peal: short strokes out from the spire, clear of the cross arms and the roof */}
      <g stroke={slot.accent}>
        <path data-part="wave" d="M5 7 3 6" style={flash("100% 100%")} />
        <path data-part="wave" d="M6 4 4 3" style={flash("100% 100%")} />
        <path data-part="wave" d="M19 7l2-1" style={flash("0% 100%")} />
        <path data-part="wave" d="M18 4l2-1" style={flash("0% 100%")} />
      </g>
      <g data-part="church" style={pivot("50% 100%")}>
        <path d="M2 22h20" />
        {/* low side aisles leaning on a tall tower with a pointed spire; they stop inside its walls */}
        <path d="M3 22v-6l3.5-2.625M21 22v-6l-3.5-2.625" />
        <path d="M7 22V11l5-5 5 5v11" />
        <path data-part="cross" d="M12 6V2M10 4h4" stroke={slot.accent} style={pivot("50% 100%")} />
        {/* the bell hangs from the belfry's centre, 2px clear of the walls and of the door's point */}
        <path data-part="bell" d="M11 11h2l1 3h-4z" fill={slot.accent} stroke="none" style={pivot("50% 0%")} />
        {/* a pointed doorway, filled */}
        <path data-part="door" d="M10 22v-4l2-2 2 2v4z" fill={slot.accent} stroke="none" style={pivot("0% 100%")} />
      </g>
    </>
  ),
})
