"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    turtle: "hide" | "walk" | "flip"
  }
}

/**
 * A shell is a genuinely round dome, so it is a true half-circle (centre (10, 15), r 8) closed by a flat
 * underside, with a central scute and four spokes. The head is a solid wedge whose flat left side,
 * x 17, sits on the dome's end: it pulls in by squeezing flat against it (scaleX from x 17). The feet
 * hang splayed from the underside and fold up into it the same way.
 */
const SHELL = "M2 15a8 8 0 0 1 16 0z"

/** 2 colors: shell (primary), head and legs (accent). */
export const Turtle = createAnimatedIcon({
  name: "turtle",
  category: "nature",
  keywords: ["tortoise", "animal", "slow", "reptile", "shell", "sea turtle", "patience"],
  slots: { primary: "shell", accent: "head + legs" },
  defaultVariant: "hide",
  variants: {
    // it pulls its head and legs into the shell and drops to the ground, peeks out halfway, ducks back
    // in, then pops right out and stands up again
    hide: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=head]",
            { scaleX: [1, 0.05, 0.05, 0.5, 0.5, 0.05, 0.05, 1.12, 1], opacity: [1, 0, 0, 1, 1, 0, 0, 1, 1] },
            {
              duration: seconds,
              times: [0, 0.14, 0.32, 0.4, 0.48, 0.54, 0.7, 0.86, 1],
              ease: [ease.in, "linear", "easeOut", "linear", ease.in, "linear", ease.out, "easeInOut"],
            },
          ),
          animate(
            "[data-part=leg]",
            { scaleY: [1, 0.05, 0.05, 1.1, 1], opacity: [1, 0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.14, 0.62, 0.76, 0.88], ease: [ease.in, "linear", ease.out, "easeInOut"] },
          ),
          animate(
            "[data-part=shell]",
            { y: [0, 3, 3, 3, 3, -1, 0], rotate: [0, 0, -4, 0, 0, 0, 0] },
            {
              duration: seconds,
              times: [0, 0.16, 0.24, 0.32, 0.6, 0.74, 0.86],
              ease: ["easeIn", "easeInOut", "easeInOut", "linear", ease.out, "easeInOut"],
            },
          ),
        ]),
    },
    // it plods along: the legs step in turn, the shell rocks and bobs, and the head nods with each step
    walk: {
      duration: 1200,
      run: ({ animate, seconds }) => {
        const step = { duration: seconds, ease: "easeInOut" as const }
        return Promise.all([
          animate("[data-part=leg-back]", { rotate: [0, 18, -18, 18, -18, 0] }, step),
          animate("[data-part=leg-front]", { rotate: [0, -18, 18, -18, 18, 0] }, step),
          animate("[data-part=shell]", { y: [0, -1, 0, -1, 0, -1, 0, -1, 0], rotate: [0, 2, 0, -2, 0, 2, 0, -2, 0] }, step),
          animate("[data-part=head]", { y: [0, 1, 0, 1, 0] }, { ...step, delay: seconds * 0.05, duration: seconds * 0.95 }),
        ])
      },
    },
    // it rolls onto its back (flipping top over bottom), paddles its legs in the air, and rights itself
    flip: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=turtle]",
            { scaleY: [1, -1, -1, 1, 1], y: [0, -2, -2, 0, 0] },
            { duration: seconds, times: [0, 0.22, 0.66, 0.88, 1], ease: ["easeInOut", "linear", ease.inOut, "easeOut"] },
          ),
          animate(
            "[data-part=leg-back]",
            { rotate: [0, 0, 22, -22, 22, -22, 0, 0] },
            { duration: seconds, times: [0, 0.22, 0.3, 0.38, 0.46, 0.54, 0.62, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=leg-front]",
            { rotate: [0, 0, -22, 22, -22, 22, 0, 0] },
            { duration: seconds, times: [0, 0.22, 0.3, 0.38, 0.46, 0.54, 0.62, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="turtle" style={pivot("50% 50%")}>
      <g data-part="shell" style={pivot("50% 100%")}>
        <path d={SHELL} />
        <path d="M7 15l1-4h4l1 4M8 11 6 8.5M12 11l2-2.5" />
        <g fill={slot.accent} stroke={slot.accent}>
          <path data-part="head" d="M17 15v-3l2-2h2l1 1v2l-2 2z" style={pivot("0% 50%")} />
          <g data-part="leg" style={pivot("50% 0%")}>
            <path data-part="leg-back" d="M4 15l-1 3h3l1-3z" style={pivot("62.5% 0%")} />
          </g>
          <g data-part="leg" style={pivot("50% 0%")}>
            <path data-part="leg-front" d="M12 15l1 3h3l-1-3z" style={pivot("37.5% 0%")} />
          </g>
        </g>
      </g>
    </g>
  ),
})
