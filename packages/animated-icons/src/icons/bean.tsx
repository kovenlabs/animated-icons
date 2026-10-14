"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"
import { spin } from "../lib/spin"

declare module "../lib/types" {
  interface IconVariants {
    bean: "jelly" | "flip" | "tumble"
  }
}

/** A faceted kidney lying on the diagonal, dented along its upper-left flank. */
const BEAN = "M5.5 18.5 9.5 20l4-1.5 5-5 1.5-4-1.5-4L14.5 4 11 5.5l-.5 3-2 2-3 .5-1.5 3.5Z"

/** The seam (hilum) following the dent, 4 clear of every edge. */
const SEAM = "M8.5 15 12 14l2-2 1-3.5"

const TURN = spin(1, "inOut")

/** 2 colors: bean (primary), seam (accent). */
export const Bean = createAnimatedIcon({
  name: "bean",
  category: "food",
  keywords: ["legume", "kidney bean", "coffee bean", "seed", "vegetable", "pulse", "vegan", "protein"],
  slots: { primary: "bean", accent: "seam" },
  defaultVariant: "jelly",
  variants: {
    // poked like a jelly bean: it squashes flat, springs up tall and wobbles itself still, leaning as it
    // goes, while the seam jiggles a beat behind
    jelly: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=bean]",
            {
              scaleX: [1, 1.1, 0.9, 1.05, 0.98, 1],
              scaleY: [1, 0.86, 1.08, 0.95, 1.02, 1],
              skewX: [0, 6, -5, 3, -1, 0],
            },
            { duration: seconds, times: [0, 0.18, 0.42, 0.62, 0.82, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=seam]",
            { scale: [1, 1, 0.8, 1.15, 0.95, 1], rotate: [0, 0, -8, 6, -2, 0] },
            { duration: seconds, times: [0, 0.2, 0.45, 0.66, 0.85, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // tossed and turned right over: it rises as it spins on its long axis, shows its plain back (the
    // seam gone) and comes back round as it lands on a squash
    flip: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=turn]",
            { scaleX: TURN.scaleX },
            { duration: seconds * 0.8, times: TURN.times, ease: TURN.ease },
          ),
          animate(
            "[data-part=seam]",
            { opacity: [1, 0, 0, 0, 1] },
            { duration: seconds * 0.8, times: TURN.times, ease: "easeInOut" },
          ),
          animate(
            "[data-part=bean]",
            { y: [0, -1.5, 0, 0, 0], scaleY: [1, 1, 1, 0.88, 1], scaleX: [1, 1, 1, 1.06, 1] },
            { duration: seconds, times: [0, 0.4, 0.8, 0.88, 1], ease: ["easeOut", "easeIn", "easeOut", "easeInOut"] },
          ),
        ]),
    },
    // it tumbles head over heels, falling away (smaller) as it turns and swinging back up close as it
    // lands the full turn, the seam rocking inside it
    tumble: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=bean]",
            { rotate: [0, -20, 200, 360, 360], scale: [1, 0.95, 0.72, 1.08, 1] },
            { duration: seconds, times: [0, 0.15, 0.55, 0.85, 1], ease: ["easeOut", ease.inOut, "easeOut", "easeInOut"] },
          ),
          animate(
            "[data-part=seam]",
            { rotate: [0, 0, 12, -10, 0] },
            { duration: seconds, times: [0, 0.4, 0.65, 0.85, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="bean" style={pivot("50% 50%")}>
      <g data-part="turn" style={pivot("50% 50%")}>
        <path d={BEAN} />
        <path data-part="seam" d={SEAM} stroke={slot.accent} style={pivot("50% 50%")} />
      </g>
    </g>
  ),
})
