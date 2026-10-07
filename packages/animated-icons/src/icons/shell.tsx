"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    shell: "open" | "tumble" | "fan"
  }
}

/**
 * A scallop: a fan opening up from its hinge at (12, 19.5), its rim a row of five flat-topped lobes. The ribs
 * run out from the hinge to the grooves between the lobes, starting halfway so they stay 2px apart.
 */
const VALVE = "M10 19.5 2.5 14.5v-1.75l1-2.75 2 .75-.5-3.25 2.25-2.75 2 2 1-3.5h3.5l1 3.5 2-2L19 7.5l-.5 3.25 2-.75 1 2.75v1.75L14 19.5"
const RIBS = "M9 15.25 5.5 10.75M10.75 13.25l-1.5-6.5M13.25 13.25l1.5-6.5M15 15.25l3.5-4.5"

/** 2 colors: shell (primary), ribs and pearl (accent). */
export const Shell = createAnimatedIcon({
  name: "shell",
  category: "nature",
  keywords: ["seashell", "scallop", "beach", "ocean", "sea", "clam", "summer", "pearl"],
  slots: { primary: "shell", accent: "ribs + pearl" },
  defaultVariant: "open",
  variants: {
    // the shell tips back on its hinge, flattening toward you, and a pearl rises out and gleams; it
    // sinks back as the shell closes with a snap. The pearl only shows while the valve is low
    open: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=valve]",
            { scaleY: [1, 0.3, 0.3, 1.08, 0.97, 1] },
            { duration: seconds, times: [0, 0.25, 0.68, 0.84, 0.93, 1], ease: [ease.inOut, "linear", "easeIn", "easeOut", "easeInOut"] },
          ),
          animate(
            "[data-part=pearl]",
            { opacity: [0, 0, 1, 1, 0, 0], scale: [0.4, 0.4, 1.25, 1, 0.6, 0.6], y: [2, 2, 0, 0, 2, 2] },
            { duration: seconds, times: [0, 0.22, 0.38, 0.55, 0.64, 1], ease: ["linear", ease.overshoot, "linear", "easeIn", "linear"] },
          ),
        ]),
    },
    // tossed by a wave, it tumbles head over heels about its middle and lands back the right way up
    tumble: {
      duration: 1200,
      clip: false,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=shell]",
          { scaleY: [1, -1, 1, 1], y: [0, -3, 0, 0], rotate: [0, -10, 0, 0] },
          { duration: seconds, times: [0, 0.4, 0.8, 1], ease: ["easeOut", "easeIn", "linear"] },
        ),
    },
    // folds shut like a hand fan and snaps back open past its width
    fan: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=valve]",
          { scaleX: [1, 0.2, 0.2, 1.15, 0.96, 1] },
          { duration: seconds, times: [0, 0.3, 0.42, 0.68, 0.85, 1], ease: [ease.inOut, "linear", ease.out, "easeInOut", "easeInOut"] },
        ),
    },
  },
  render: () => (
    <g data-part="shell" style={pivot("50% 50%")}>
      {/* the pearl is round: a true circle, hidden until the shell opens */}
      <circle data-part="pearl" cx="12" cy="9" r="2.5" fill={slot.accent} stroke="none" style={flash()} />
      {/* the valve turns on its hinge: the middle of its bottom edge */}
      <g data-part="valve" style={pivot("50% 100%")}>
        <path d={VALVE} />
        <path d={RIBS} stroke={slot.accent} />
      </g>
      {/* the hinge's two ears, closing the valve's bottom edge */}
      <path d="M8.5 22 10 19.5h4l1.5 2.5z" />
    </g>
  ),
})
