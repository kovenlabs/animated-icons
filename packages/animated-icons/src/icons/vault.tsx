"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    vault: "open" | "spin" | "drop"
  }
}

/** The vault's front: the door covers it exactly when shut, so the box shows only once the door swings. */
const FRONT = "M3 3h18v16H3z"

/** 2 colors: vault and door (primary), wheel and gold (accent). */
export const Vault = createAnimatedIcon({
  name: "vault",
  category: "finance",
  keywords: ["safe", "bank", "strongbox", "savings", "secure storage", "deposit", "treasury", "gold"],
  slots: { primary: "vault + door", accent: "wheel + gold" },
  defaultVariant: "open",
  variants: {
    // the wheel spins to unlock, the door swings open toward you on its left hinge (narrowing and tilting
    // in perspective) to show a gold bar inside, then slams shut with a bounce and the wheel locks again
    open: {
      duration: 1500,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=wheel]",
            { rotate: [0, 180, 180, 0] },
            { duration: seconds, times: [0, 0.2, 0.86, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=door]",
            {
              scaleX: [1, 1, 0.2, 0.2, 1.04, 1, 1],
              scaleY: [1, 1, 1.08, 1.08, 1, 1, 1],
              skewY: [0, 0, 10, 10, 0, 0, 0],
            },
            {
              duration: seconds,
              times: [0, 0.2, 0.42, 0.64, 0.8, 0.88, 1],
              ease: ["linear", "easeInOut", "linear", ease.in, "easeOut", "linear"],
            },
          ),
          animate(
            "[data-part=gold]",
            { opacity: [0, 0, 1, 1, 0, 0], scale: [0.6, 0.6, 1, 1, 1, 1] },
            { duration: seconds, times: [0, 0.37, 0.46, 0.63, 0.68, 1], ease: ease.overshoot },
          ),
        ]),
    },
    // the combination wheel winds back, spins a full turn past home and settles, and the vault clunks
    spin: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=wheel]",
            { rotate: [0, -40, 385, 360] },
            { duration: seconds, times: [0, 0.2, 0.8, 1], ease: ["easeOut", "easeInOut", "easeOut"] },
          ),
          animate(
            "[data-part=vault]",
            { scaleY: [1, 1, 0.95, 1] },
            { duration: seconds, times: [0, 0.8, 0.88, 1], ease: "easeOut" },
          ),
        ]),
    },
    // heaved up off the floor, it hangs a moment, drops like a weight and squashes; the wheel jolts round
    drop: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=vault]",
            {
              y: [0, -3, -3, 0, 0, 0],
              scaleX: [1, 0.97, 0.97, 1.08, 0.98, 1],
              scaleY: [1, 1.04, 1.04, 0.88, 1.03, 1],
            },
            {
              duration: seconds,
              times: [0, 0.35, 0.48, 0.58, 0.78, 1],
              ease: ["easeOut", "linear", ease.in, "easeOut", "easeInOut"],
            },
          ),
          animate(
            "[data-part=wheel]",
            { rotate: [0, 0, 40, -12, 0] },
            { duration: seconds, times: [0, 0.58, 0.72, 0.86, 1], ease: "easeOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="vault" style={pivot("50% 100%")}>
      <path d={FRONT} />
      <path d="M6 19v2M18 19v2" />
      {/* a gold bar inside, only there while the door is open */}
      <path data-part="gold" d="M9 15.5l1.5-3.5h5l1.5 3.5z" fill={slot.accent} stroke="none" style={flash("50% 100%")} />
      <g data-part="door" style={pivot("0% 50%")}>
        <path d={FRONT} />
        {/* the wheel is round: a true circle hub with four spokes */}
        <g data-part="wheel" stroke={slot.accent} style={pivot("50% 50%")}>
          <circle cx="12" cy="11" r="2.5" />
          <path d="M10.5 9.5 8 7M13.5 9.5 16 7M13.5 12.5 16 15M10.5 12.5 8 15" />
        </g>
      </g>
    </g>
  ),
})
