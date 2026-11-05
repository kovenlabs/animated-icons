"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"
import { badgeGlyph } from "../lib/parts"

declare module "../lib/types" {
  interface IconVariants {
    "shield-x": "deny" | "shake" | "turn"
  }
}

/** The badge X centred on the shield's face, split into its two strokes so `deny` can redraw them in turn. */
const STROKES = badgeGlyph.x(12, 11.5).split(/(?=M)/)

/** 2 colors: shield (primary), X (accent). */
export const ShieldX = createAnimatedIcon({
  name: "shield-x",
  family: "shield",
  category: "security",
  keywords: ["blocked", "threat", "unprotected", "security error", "access denied", "insecure", "not verified"],
  slots: { primary: "shield", accent: "x" },
  defaultVariant: "deny",
  variants: {
    // the X fades out and strikes again, one stroke after the other (each hidden while too short to
    // read), and the shield flinches as the second lands
    deny: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          ...STROKES.map((_, i) => {
            const start = 0.2 + i * 0.3
            return Promise.all([
              animate(`[data-part=stroke-${i + 1}]`, { opacity: [1, 0, 0, 1, 1] }, { duration: seconds, times: [0, 0.15, start, start + 0.01, 1] }),
              animate(
                `[data-part=stroke-${i + 1}]`,
                { pathLength: [1, 1, 0, 1, 1] },
                { duration: seconds, times: [0, start - 0.01, start, start + 0.3, 1], ease: "easeOut" },
              ),
            ])
          }),
          animate(
            "[data-part=shield]",
            { scale: [1, 1, 1.06, 1] },
            { duration: seconds, times: [0, 0.7, 0.85, 1], ease: "easeOut" },
          ),
        ]),
    },
    // the shield shakes its head, side to side, damped
    shake: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate("[data-part=guard]", { x: [0, -1.5, 1.5, -1, 0.5, 0] }, { duration: seconds, ease: "easeInOut" }),
    },
    // the X turns a quarter on its centre with a small swell (an X looks the same at -90°, so it starts there unseen)
    turn: {
      duration: 650,
      run: ({ animate, seconds }) =>
        animate("[data-part=x]", { rotate: [-90, 0], scale: [1, 1.12, 1] }, { duration: seconds, ease: "easeInOut" }),
    },
  },
  render: () => (
    <g data-part="guard" style={pivot("50% 100%")}>
      {/* the shield family's faceted outline: flat shoulders, straight sides, three facets down to the point */}
      <path data-part="shield" d="M12 2l8 3v7l-3 5-5 4-5-4-3-5V5z" style={pivot("50% 50%")} />
      <g data-part="x" stroke={slot.accent} style={pivot("50% 50%")}>
        {STROKES.map((d, i) => (
          <path key={d} data-part={`stroke-${i + 1}`} d={d} />
        ))}
      </g>
    </g>
  ),
})
