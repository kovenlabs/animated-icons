"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    atom: "orbit" | "flip" | "swap"
  }
}

/** Each orbit is an ellipse 11 × 5 around the nucleus, tipped 45° either way. */
const RX = 11
const RY = 5
const STEPS = 16

/**
 * One electron's lap of its orbit, in the orbit's own (untipped) frame, starting `phase` degrees round.
 * The lower half of the ellipse is the near side: there the electron swells and brightens, and on the
 * far side it shrinks and dims, so it reads as passing in front of the nucleus and then behind it.
 * It fades in at the start of the lap and out at the end, since it only exists in motion.
 */
function lap(phase: number) {
  const angles = Array.from({ length: STEPS + 1 }, (_, i) => ((phase + (360 / STEPS) * i) * Math.PI) / 180)
  const depth = angles.map((a) => Math.sin(a))
  return {
    x: angles.map((a) => RX * Math.cos(a)),
    y: angles.map((a) => RY * Math.sin(a)),
    scale: depth.map((d) => 1 + 0.35 * d),
    opacity: depth.map((d, i) => (i === 0 || i === STEPS ? 0 : 0.65 + 0.35 * d)),
  }
}

/** 2 colors: orbits (primary), nucleus + electrons (accent). The electrons only exist in motion. */
export const Atom = createAnimatedIcon({
  name: "atom",
  category: "education",
  keywords: ["science", "physics", "chemistry", "nuclear", "electron", "molecule", "react", "proton"],
  slots: { primary: "orbits", accent: "nucleus + electrons" },
  defaultVariant: "orbit",
  variants: {
    // an electron runs a lap of each orbit, swelling as it swings round the near side and shrinking
    // as it passes behind the nucleus
    orbit: {
      duration: 1400,
      clip: false,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=electron-a]", lap(0), { duration: seconds, ease: "linear" }),
          animate("[data-part=electron-b]", lap(180), { duration: seconds, ease: "linear" }),
          // it shrinks as each electron skims past and swells while they are out at the far ends
          animate(
            "[data-part=nucleus]",
            { scale: [1, 0.8, 1.25, 0.8, 1] },
            { duration: seconds, ease: "easeInOut" },
          ),
        ]),
    },
    // the whole atom turns a full circle about its upright axis, edge-on twice, the nucleus
    // swelling as it comes round to face you
    flip: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=atom]",
            { scaleX: [1, 0, -1, 0, 1] },
            { duration: seconds, ease: ["easeIn", "easeOut", "easeIn", "easeOut"] },
          ),
          animate(
            "[data-part=nucleus]",
            { scale: [1, 1.5, 1] },
            { duration: seconds * 0.5, delay: seconds * 0.5, ease: ease.overshoot },
          ),
        ]),
    },
    // the two orbits swing past each other into each other's places, meeting upright on the way,
    // while the nucleus pops. Each orbit is symmetric, so the end pose is the rest pose
    swap: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=orbit-a]",
            { rotate: [0, 90, 0] },
            { duration: seconds, times: [0, 0.999, 1], ease: [ease.overshoot, snap] },
          ),
          animate(
            "[data-part=orbit-b]",
            { rotate: [0, -90, 0] },
            { duration: seconds, times: [0, 0.999, 1], ease: [ease.overshoot, snap] },
          ),
          animate("[data-part=nucleus]", { scale: [1, 1.5, 0.9, 1] }, { duration: seconds, ease: "easeInOut" }),
        ]),
    },
  },
  render: () => (
    <g data-part="atom" style={pivot("50% 50%")}>
      {/* the orbits are round: true ellipses, tipped by a static group so their parts animate untipped */}
      <g transform="rotate(-45 12 12)">
        <ellipse data-part="orbit-a" cx="12" cy="12" rx={RX} ry={RY} style={pivot("50% 50%")} />
        <circle data-part="electron-a" cx="12" cy="12" r="1.75" fill={slot.accent} stroke="none" style={flash()} />
      </g>
      <g transform="rotate(45 12 12)">
        <ellipse data-part="orbit-b" cx="12" cy="12" rx={RX} ry={RY} style={pivot("50% 50%")} />
        <circle data-part="electron-b" cx="12" cy="12" r="1.75" fill={slot.accent} stroke="none" style={flash()} />
      </g>
      {/* 2 clear of either orbit where it passes closest */}
      <circle data-part="nucleus" cx="12" cy="12" r="2" fill={slot.accent} stroke="none" style={pivot("50% 50%")} />
    </g>
  ),
})

