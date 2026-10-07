"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    skull: "chatter" | "look" | "glare"
  }
}

/** 2 colors: bone (primary), eye sockets (accent). */
export const Skull = createAnimatedIcon({
  name: "skull",
  category: "gaming",
  keywords: ["death", "danger", "poison", "halloween", "pirate", "game over", "dead", "spooky"],
  slots: { primary: "bone", accent: "eye sockets" },
  defaultVariant: "chatter",
  variants: {
    // a cackle: the jaw clacks open and shut while the whole skull rocks on it
    chatter: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=jaw]",
            { y: [0, 2.5, 0, 2.5, 0, 2, 0] },
            { duration: seconds, ease: ["easeOut", "easeIn", "easeOut", "easeIn", "easeOut", "easeIn"] },
          ),
          animate(
            "[data-part=skull]",
            { rotate: [0, -8, 6, -6, 4, -2, 0], y: [0, -1, 0, -1, 0, -0.5, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
        ]),
    },
    // the head turns to look left, then right: the skull narrows as it turns and the face slides round
    // ahead of it, further than the bone, like it has depth
    look: {
      duration: 1400,
      run: ({ animate, seconds }) => {
        const timing = { duration: seconds, times: [0, 0.2, 0.4, 0.5, 0.65, 0.85, 1], ease: "easeInOut" as const }
        const narrow = { scaleX: [1, 0.9, 0.9, 1, 0.9, 0.9, 1] }
        return Promise.all([
          animate("[data-part=head]", narrow, timing),
          animate("[data-part=jaw]", narrow, timing),
          animate(
            "[data-part=face]",
            { x: [0, -1.5, -1.5, 0, 1.5, 1.5, 0], scaleX: [1, 0.8, 0.8, 1, 0.8, 0.8, 1] },
            timing,
          ),
          animate("[data-part=teeth]", { x: [0, -1, -1, 0, 1, 1, 0] }, timing),
        ])
      },
    },
    // the sockets snap shut, then flare wide, and the skull shudders with them
    glare: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=eye]",
            { scaleY: [1, 0.15, 1.4, 1.4, 1], scaleX: [1, 1.1, 1.3, 1.3, 1] },
            { duration: seconds, times: [0, 0.2, 0.4, 0.7, 1], ease: ["easeIn", "easeOut", "linear", "easeInOut"] },
          ),
          animate(
            "[data-part=skull]",
            { x: [0, 0, -0.75, 0.75, -0.75, 0.75, 0], scale: [1, 0.96, 1.08, 1.08, 1.06, 1.04, 1] },
            { duration: seconds, times: [0, 0.2, 0.4, 0.5, 0.6, 0.7, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="skull" style={pivot("50% 100%")}>
      <g data-part="head" style={pivot("50% 50%")}>
        {/* a round cranium (a true arc), cheekbones cut in to the jaw line that closes it */}
        <path d="M6 18 4 16v-5a8 8 0 0 1 16 0v5l-2 2z" />
        <g data-part="face" fill={slot.accent} stroke="none" style={pivot("50% 50%")}>
          <rect data-part="eye" x="7.5" y="10" width="3" height="3" style={pivot("50% 50%")} />
          <rect data-part="eye" x="13.5" y="10" width="3" height="3" style={pivot("50% 50%")} />
        </g>
      </g>
      {/* the jaw hangs from the cheekbones, split into three teeth */}
      <g data-part="jaw" style={pivot("50% 50%")}>
        <path d="M6 18v4h12v-4" />
        <path data-part="teeth" d="M10 18v4M14 18v4" />
      </g>
    </g>
  ),
})
