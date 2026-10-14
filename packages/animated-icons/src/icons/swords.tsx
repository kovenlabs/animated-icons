"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { blink, ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    swords: "clash" | "grind" | "salute"
  }
}

/** A four-point spark where the blades meet, above their crossing. */
const SPARK = "M12 3l.9 1.6 1.6.9-1.6.9L12 8l-.9-1.6-1.6-.9 1.6-.9Z"

/** 2 colors: blades (primary), hilts and spark (accent). */
export const Swords = createAnimatedIcon({
  name: "swords",
  category: "gaming",
  keywords: ["battle", "fight", "duel", "combat", "fencing", "attack", "versus", "war"],
  slots: { primary: "blades", accent: "hilts + spark" },
  defaultVariant: "clash",
  variants: {
    // both swords wind back on their grips and strike together: the blades bite past the cross and a
    // spark flies off the impact
    clash: {
      clip: true,
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=sword-a]",
            { rotate: [0, -10, 7, -2, 0] },
            { duration: seconds, times: [0, 0.35, 0.5, 0.75, 1], ease: ["easeOut", ease.in, "easeOut", "easeInOut"] },
          ),
          animate(
            "[data-part=sword-b]",
            { rotate: [0, 10, -7, 2, 0] },
            { duration: seconds, times: [0, 0.35, 0.5, 0.75, 1], ease: ["easeOut", ease.in, "easeOut", "easeInOut"] },
          ),
          animate(
            "[data-part=spark]",
            { ...blink, scale: [0.4, 1.4, 1.8], rotate: [0, 45, 90] },
            { duration: seconds * 0.45, delay: seconds * 0.45, ease: "easeOut" },
          ),
        ]),
    },
    // locked blades scraping: each sword slides along its own line, one drawn back as the other
    // presses in, and back again, sparking at the cross
    grind: {
      clip: true,
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=sword-a]",
            { x: [0, 1.5, -2, 0], y: [0, 1.5, -2, 0] },
            { duration: seconds, times: [0, 0.35, 0.7, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=sword-b]",
            { x: [0, 2, -1.5, 0], y: [0, -2, 1.5, 0] },
            { duration: seconds, times: [0, 0.35, 0.7, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=spark]",
            { ...blink, scale: [0.6, 1.3, 0.8] },
            { duration: seconds * 0.35, delay: seconds * 0.3, ease: "easeOut" },
          ),
        ]),
    },
    // raised in salute: the pair leaps toward you, turns over on its vertical axis, and lands with a squash
    salute: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=swords]",
          {
            y: [0, -0.8, -0.8, 0, 0],
            scale: [1, 1.06, 1.06, 1, 1],
            scaleX: [1, 1, -1, 1, 1],
            scaleY: [1, 1, 1, 0.86, 1],
          },
          { duration: seconds, times: [0, 0.25, 0.55, 0.78, 1], ease: ["easeOut", ease.inOut, "easeIn", ease.overshoot] },
        ),
    },
  },
  render: () => (
    <>
      <g data-part="swords" style={pivot("50% 100%")}>
        {/* two mirrored swords crossed at the centre: a blade tapering to a point, then guard, grip, pommel */}
        <g data-part="sword-a" style={pivot("78% 78%")}>
          <path d="M14.5 17.5 4 7 3 3l4 1 10.5 10.5" />
          <path d="M14 18l5-5M16 16l4 4M19 21l2-2" stroke={slot.accent} />
        </g>
        <g data-part="sword-b" style={pivot("22% 78%")}>
          <path d="M9.5 17.5 20 7l1-4-4 1L6.5 14.5" />
          <path d="M10 18l-5-5M8 16l-4 4M5 21l-2-2" stroke={slot.accent} />
        </g>
      </g>
      <path data-part="spark" d={SPARK} fill={slot.accent} stroke="none" style={flash()} />
    </>
  ),
})
