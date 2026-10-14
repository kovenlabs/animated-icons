"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "shield-ban": "block" | "spin" | "shake"
  }
}

/** 2 colors: shield (primary), slash (accent). */
export const ShieldBan = createAnimatedIcon({
  name: "shield-ban",
  family: "shield",
  category: "security",
  keywords: ["blocked", "firewall", "forbidden", "denied", "banned", "access denied", "restricted", "protection"],
  slots: { primary: "shield", accent: "slash" },
  defaultVariant: "block",
  variants: {
    // the slash fades out and strikes across again; the shield takes the hit, squashing wide on its
    // point and kicking back
    block: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=slash]",
            { opacity: [1, 0, 0, 1] },
            { duration: seconds * 0.35, times: [0, 0.4, 0.55, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=slash]",
            { pathLength: [1, 1, 0, 1] },
            { duration: seconds * 0.6, times: [0, 0.2, 0.22, 1], ease: "easeIn" },
          ),
          animate(
            "[data-part=guard]",
            { scaleY: [1, 1, 0.82, 1], scaleX: [1, 1, 1.08, 1], rotate: [0, 0, 4, 0] },
            { duration: seconds, times: [0, 0.6, 0.72, 1], ease: "easeOut" },
          ),
        ]),
    },
    // the shield turns a full turn on its upright axis in perspective, the slash flipping to the other
    // diagonal on its back, and lands with a squash
    spin: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=shield]",
            { scaleX: [1, -1, 1], skewY: [0, 8, 0, -8, 0] },
            { duration: seconds * 0.7, ease: "easeInOut" },
          ),
          animate(
            "[data-part=guard]",
            { scale: [1, 0.9, 0.9, 1], scaleY: [1, 1, 1, 0.88, 1] },
            { duration: seconds, times: [0, 0.25, 0.65, 0.82, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // refuses: swings its head side to side, turning away in perspective at each end, damped
    shake: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=guard]",
          {
            x: [0, -2, 2, -1.2, 0.6, 0],
            scaleX: [1, 0.84, 0.84, 0.92, 0.97, 1],
            skewY: [0, -6, 6, -3, 1, 0],
          },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <g data-part="guard" style={pivot("50% 100%")}>
      <g data-part="shield" style={pivot("50% 50%")}>
        {/* the shield family's faceted outline: flat shoulders, straight sides, three facets down to the point */}
        <path d="M12 2l8 3v7l-3 5-5 4-5-4-3-5V5z" />
        {/* the slash runs from the left side down to the lower-right facet, both ends clear of the corners */}
        <path data-part="slash" d="M4 8 15 18.6" stroke={slot.accent} />
      </g>
    </g>
  ),
})
