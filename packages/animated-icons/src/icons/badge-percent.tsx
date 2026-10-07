"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot, snap } from "../lib/motion"
import { ROSETTE } from "../lib/parts"

declare module "../lib/types" {
  interface IconVariants {
    "badge-percent": "flip" | "spin" | "slap"
  }
}

/** 2 colors: badge (primary), percent sign (accent). */
export const BadgePercent = createAnimatedIcon({
  name: "badge-percent",
  family: "badge",
  category: "commerce",
  keywords: ["discount", "sale", "offer", "promo", "deal", "coupon", "price tag", "percent off"],
  slots: { primary: "badge", accent: "percent sign" },
  defaultVariant: "flip",
  variants: {
    // the sticker turns over on its vertical axis: its back is blank, and the sign is back as it comes
    // round to face you, then each dot pops
    flip: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=seal]",
            { scaleX: [1, 0, -1, 0, 1, 1] },
            { duration: seconds, times: [0, 0.14, 0.28, 0.42, 0.56, 1], ease: ["easeIn", "easeOut", "easeIn", "easeOut", "linear"] },
          ),
          animate(
            "[data-part=percent]",
            { opacity: [1, 1, 0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.13, 0.14, 0.41, 0.42, 1], ease: ["linear", snap, "linear", snap, "linear"] },
          ),
          ...["dot-0", "dot-1"].map((dot, i) =>
            animate(
              `[data-part=${dot}]`,
              { scale: [1, 1, 1.8, 1] },
              { duration: seconds, times: [0, 0.56 + i * 0.1, 0.7 + i * 0.1, 0.88 + i * 0.06], ease: ["linear", ease.out, "easeInOut"] },
            ),
          ),
        ]),
    },
    // the rosette spins a full turn under the sign, which stays upright and pumps as it passes
    spin: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=badge]", { rotate: [0, 360] }, { duration: seconds, ease: "easeInOut" }),
          animate(
            "[data-part=percent]",
            { scale: [1, 0.8, 1.25, 1] },
            { duration: seconds, times: [0, 0.35, 0.7, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // slapped on like a sticker: lifted toward you with a twist, then pressed flat with a squash
    slap: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=seal]",
          { scale: [1, 1.35, 0.88, 1.05, 1], rotate: [0, -12, 3, 0, 0], y: [0, -1.5, 0, 0, 0] },
          { duration: seconds, times: [0, 0.35, 0.55, 0.75, 1], ease: ["easeOut", ease.in, "easeOut", "easeInOut"] },
        ),
    },
  },
  render: () => (
    <g data-part="seal" style={pivot("50% 50%")}>
      <path data-part="badge" d={ROSETTE} style={pivot("50% 50%")} />
      {/* the dots sit 2 clear of the slash, out toward two of the rosette's points */}
      <g data-part="percent" style={pivot("50% 50%")}>
        <path d="M15 9l-6 6" stroke={slot.accent} />
        <g fill={slot.accent} stroke="none">
          <rect data-part="dot-0" x="7.5" y="7.5" width="2" height="2" style={pivot("50% 50%")} />
          <rect data-part="dot-1" x="14.5" y="14.5" width="2" height="2" style={pivot("50% 50%")} />
        </g>
      </g>
    </g>
  ),
})
