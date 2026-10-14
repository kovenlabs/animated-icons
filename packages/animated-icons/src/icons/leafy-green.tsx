"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"
import { spin } from "../lib/spin"

declare module "../lib/types" {
  interface IconVariants {
    "leafy-green": "unfurl" | "turn" | "rustle"
  }
}

/** A ruffled leaf of lettuce: a ring of short facets, its stem end at the bottom-left corner. */
const LEAF =
  "M3 21l1-3.5L3 14l2-3-.5-3.5 3-1.5L9 3.5l3.5.5L15 2.5l2.5 2.5 3.5 1-.5 3.5 1 3-2.5 2.5-1 3.5-3.5.5-2.5 2.5-4-1Z"

const TURN = spin(1, "inOut")

/** 2 colors: leaf (primary), stem and veins (accent). */
export const LeafyGreen = createAnimatedIcon({
  name: "leafy-green",
  category: "food",
  keywords: ["lettuce", "salad", "vegetable", "greens", "kale", "cabbage", "vegan", "healthy"],
  slots: { primary: "leaf", accent: "stem + veins" },
  defaultVariant: "unfurl",
  variants: {
    // the leaf sprouts from its stem end, swinging up from the ground as it grows past full size, the
    // stem drawing up its middle and the veins popping out last
    unfurl: {
      clip: true,
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=leaf]",
            { scale: [0, 0.7, 1.04, 0.98, 1], rotate: [35, 12, -3, 1, 0] },
            { duration: seconds * 0.7, times: [0, 0.35, 0.65, 0.85, 1], ease: [ease.out, "easeOut", "easeInOut", "easeInOut"] },
          ),
          animate(
            "[data-part=rib]",
            { pathLength: [0, 0, 1, 1], opacity: [0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.3, 0.65, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=vein]",
            { scale: [0, 0, 1.5, 1] },
            { duration: seconds, times: [0, 0.6, 0.82, 1], ease: "easeOut" },
          ),
        ]),
    },
    // the leaf turns right over on its stem like a page, pinching thin as it goes edge-on, shows its
    // back and comes round again
    turn: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=blade]",
          { scaleX: TURN.scaleX, scaleY: [1, 0.9, 1, 0.9, 1] },
          { duration: seconds, times: TURN.times, ease: TURN.ease },
        ),
    },
    // a breeze rustles it: the ruffled leaf shivers from side to side and its veins curl in towards the
    // stem and spring back out, as if the leaf were folding on itself
    rustle: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=blade]",
            { skewX: [0, -6, 5, -3, 1, 0], scaleX: [1, 0.92, 0.95, 0.94, 0.98, 1], scaleY: [1, 1.03, 0.97, 1.02, 1, 1] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=vein]",
            { rotate: [0, 0, 22, -4, 0] },
            { duration: seconds, times: [0, 0.15, 0.45, 0.75, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=vein-side]",
            { rotate: [0, 0, -22, 4, 0] },
            { duration: seconds, times: [0, 0.2, 0.5, 0.8, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    // grows from its stem end; turns and rustles about the middle of its base
    <g data-part="leaf" style={pivot("0% 100%")}>
      <g data-part="blade" style={pivot("50% 100%")}>
        <path d={LEAF} />
        <g stroke={slot.accent}>
          <path data-part="rib" d="M3 21 15 9" />
          {/* the veins leave the stem at 45°, each hinged where it meets it */}
          <path data-part="vein" d="M9 15v-3" style={pivot("50% 100%")} />
          <path data-part="vein-side" d="M12 12h4" style={pivot("0% 50%")} />
        </g>
      </g>
    </g>
  ),
})
