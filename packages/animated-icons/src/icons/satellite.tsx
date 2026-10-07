"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    satellite: "orbit" | "deploy" | "beam"
  }
}

const round = (n: number) => Math.round(n * 1000) / 1000

/**
 * One lap of a tilted orbit, sampled so motion can run it linearly: front of the orbit at rest (full
 * size, full strength), the far side higher up, smaller and fainter. The lap is eased in and out, so
 * the satellite leaves and returns to rest gently.
 */
const ORBIT = (() => {
  const steps = 16
  const inOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)
  const frames = Array.from({ length: steps + 1 }, (_, i) => {
    const angle = 2 * Math.PI * inOut(i / steps)
    const depth = (1 - Math.cos(angle)) / 2 // 0 at the front, 1 at the back
    return {
      x: round(3.5 * Math.sin(angle)),
      y: round(-3 * depth),
      scale: round(1 - 0.45 * depth),
      opacity: round(1 - 0.5 * depth),
    }
  })
  return {
    x: frames.map((f) => f.x),
    y: frames.map((f) => f.y),
    scale: frames.map((f) => f.scale),
    opacity: frames.map((f) => f.opacity),
  }
})()

/** Two full turns of each array on its strut, cos-shaped: slow off the face, fast through the edge. */
const SPIN = [1, 0, -1, 0, 1, 0, -1, 0, 1]

/** 2 colors: body, struts and solar arrays (primary), beacon and signal (accent). */
export const Satellite = createAnimatedIcon({
  name: "satellite",
  category: "devices",
  keywords: ["space", "orbit", "gps", "broadcast", "signal", "communication", "solar panel", "spacecraft"],
  slots: { primary: "body + solar arrays", accent: "beacon + signal" },
  defaultVariant: "orbit",
  variants: {
    // a lap of a tilted orbit: it swings out, passes behind smaller and fainter and comes round to the
    // front again, its solar arrays spinning on their struts all the way
    orbit: {
      duration: 1400,
      clip: true,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=satellite]", ORBIT, { duration: seconds, ease: "linear" }),
          animate(
            "[data-part=array]",
            { scaleY: SPIN },
            { duration: seconds, ease: ["easeIn", "easeOut", "easeIn", "easeOut", "easeIn", "easeOut", "easeIn", "easeOut"] },
          ),
        ]),
    },
    // the arrays fold in against the body, then swing out one after the other with an overshoot, and
    // the beacon pings once they lock
    deploy: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          ...["wing-left", "wing-right"].map((part, i) =>
            animate(
              `[data-part=${part}]`,
              { scaleX: [1, 0, 0, 1.08, 0.97, 1] },
              {
                duration: seconds,
                times: [0, 0.22, 0.32 + i * 0.1, 0.55 + i * 0.1, 0.68 + i * 0.1, 0.8 + i * 0.1],
                ease: ["easeIn", "linear", ease.out, "easeInOut", "easeInOut"],
              },
            ),
          ),
          animate(
            "[data-part=beacon]",
            { scale: [1, 1, 1.8, 1] },
            { duration: seconds, times: [0, 0.72, 0.82, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=wave]",
            { opacity: [0, 0, 1, 0], y: [0, 0, 0.5, 2] },
            { duration: seconds, times: [0, 0.74, 0.84, 1], ease: "easeOut" },
          ),
        ]),
    },
    // it dips its nose toward the ground and beams down: the signal pulses out of the beacon twice
    beam: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=satellite]",
            { rotate: [0, -12, -12, 4, 0], y: [0, 1, 1, -0.5, 0] },
            { duration: seconds, times: [0, 0.2, 0.75, 0.9, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=beacon]",
            { scale: [1, 1.7, 1, 1.7, 1] },
            { duration: seconds * 0.7, delay: seconds * 0.15, ease: "easeInOut" },
          ),
          animate(
            "[data-part=wave]",
            { opacity: [0, 1, 0, 0, 1, 0], y: [-1, 0.5, 2.5, -1, 0.5, 2.5], scale: [0.7, 1, 1.2, 0.7, 1, 1.2] },
            { duration: seconds * 0.75, delay: seconds * 0.15, times: [0, 0.2, 0.48, 0.5, 0.7, 0.98], ease: "easeOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="satellite" style={pivot("50% 50%")}>
      {/* drawn level and turned 45°: arrays to the upper left and lower right, beacon toward the ground */}
      <g transform="rotate(45 12 12)">
        <path d="M9.5 9.5h5v5h-5z" />
        {/* each wing is a strut and its array; it folds from where the strut meets the body. The arrays
            are long and narrow, across the strut, so they read as panels and not as more bodies */}
        <g data-part="wing-left" style={pivot("100% 50%")}>
          <path d="M6.5 12h3" />
          <path data-part="array" d="M2.5 7.5h4v9h-4z" style={pivot("50% 50%")} />
        </g>
        <g data-part="wing-right" style={pivot("0% 50%")}>
          <path d="M14.5 12h3" />
          <path data-part="array" d="M17.5 7.5h4v9h-4z" style={pivot("50% 50%")} />
        </g>
        <path d="M12 14.5v2" />
        <rect data-part="beacon" x="11" y="16.5" width="2" height="2" fill={slot.accent} stroke="none" style={pivot("50% 50%")} />
        {/* a radio wave is round, so it is a true arc round the beacon */}
        <path data-part="wave" d="M9.419 21.186A4.5 4.5 0 0 0 14.581 21.186" stroke={slot.accent} style={flash()} />
      </g>
    </g>
  ),
})
