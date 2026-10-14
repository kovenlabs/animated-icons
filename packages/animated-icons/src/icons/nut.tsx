"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"
import { spin } from "../lib/spin"

declare module "../lib/types" {
  interface IconVariants {
    nut: "drop" | "wobble" | "pop"
  }
}

/** The cupule: a flat-bottomed dome with square shoulders, overhanging the nut on both sides. */
const CAP = "M4 12l1-3 3.5-2h7l3.5 2 1 3Z"

/** The nut hangs from the cap's rim and tapers to a point. */
const BODY = "M5.5 12v2.5l3 4 3.5 3 3.5-3 3-4V12"

const TURN = spin(1, "inOut")

/** 2 colors: nut (primary), cap and stem (accent). */
export const Nut = createAnimatedIcon({
  name: "nut",
  category: "food",
  keywords: ["acorn", "oak", "hazelnut", "autumn", "fall", "squirrel", "seed", "forest"],
  slots: { primary: "nut", accent: "cap + stem" },
  defaultVariant: "drop",
  variants: {
    // it falls from the oak, stretched long, lands on a fat squash, and the knock bounces its cap up
    // off the nut, rocking, before it settles back on
    drop: {
      clip: true,
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=acorn]",
            { y: [-22, 0, 0, 0, 0], scaleY: [1.15, 1.15, 0.8, 1.06, 1], scaleX: [0.9, 0.9, 1.1, 0.97, 1] },
            { duration: seconds * 0.7, times: [0, 0.4, 0.55, 0.78, 1], ease: [ease.in, "linear", "easeOut", "easeInOut"] },
          ),
          animate(
            "[data-part=cap]",
            { y: [0, 0, -2.5, 0, -0.8, 0], rotate: [0, 0, -10, 0, 4, 0] },
            { duration: seconds, times: [0, 0.32, 0.52, 0.7, 0.82, 1], ease: ["linear", ease.out, ease.in, "easeOut", "easeIn"] },
          ),
        ]),
    },
    // it rocks on its point like a spinning top running down, and the stem flicks the other way
    wobble: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=acorn]",
            { rotate: [0, -10, 8, -5, 2, 0] },
            { duration: seconds, times: [0, 0.2, 0.42, 0.62, 0.82, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=stem]",
            { rotate: [0, 30, -26, 16, -6, 0] },
            { duration: seconds, times: [0, 0.24, 0.46, 0.66, 0.85, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the cap pops off like a lid, spinning a full turn in the air, as the nut stretches up after it,
    // then drops back on and squashes the nut
    pop: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=cap]",
            { y: [0, 0, -3, -3, 0, 0] },
            { duration: seconds, times: [0, 0.12, 0.3, 0.52, 0.66, 1], ease: ["linear", ease.out, "linear", ease.in, "linear"] },
          ),
          animate(
            "[data-part=lid]",
            { scaleX: TURN.scaleX },
            { duration: seconds * 0.4, delay: seconds * 0.18, times: TURN.times, ease: TURN.ease },
          ),
          animate(
            "[data-part=body]",
            { scaleY: [1, 0.9, 1.08, 1, 0.88, 1.03, 1], scaleX: [1, 1.06, 0.95, 1, 1.08, 0.98, 1] },
            { duration: seconds, times: [0, 0.12, 0.3, 0.5, 0.7, 0.85, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    // it rocks on the point of the nut
    <g data-part="acorn" style={pivot("50% 100%")}>
      <path data-part="body" d={BODY} style={pivot("50% 100%")} />
      <g data-part="cap" stroke={slot.accent} style={pivot("50% 100%")}>
        <g data-part="lid" style={pivot("50% 50%")}>
          <path data-part="stem" d="M12 5v2" style={pivot("50% 100%")} />
          <path d={CAP} />
        </g>
      </g>
    </g>
  ),
})
