"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    rabbit: "hop" | "flop" | "listen"
  }
}

/** A wide, faceted head. The ears stand on its flat top, open at the base, which the head closes. */
const HEAD = "M4 15l3-4h10l3 4v3l-3 3H7l-3-3z"

/** 2 colors: head and ears (primary), eyes and nose (accent). */
export const Rabbit = createAnimatedIcon({
  name: "rabbit",
  category: "nature",
  keywords: ["bunny", "hare", "animal", "pet", "easter", "fast", "bunny ears"],
  slots: { primary: "head + ears", accent: "eyes + nose" },
  defaultVariant: "hop",
  variants: {
    // it crouches and springs up with its ears pressed short by the air, then lands with a squash while
    // the ears splay out late and wobble out of step before they settle
    hop: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=rabbit]",
            { y: [0, 1, -2.5, 0, 0, 0], scaleY: [1, 0.88, 1, 0.86, 1.02, 1], scaleX: [1, 1.08, 0.98, 1.1, 0.99, 1] },
            {
              duration: seconds,
              times: [0, 0.15, 0.38, 0.55, 0.68, 0.8],
              ease: ["easeInOut", ease.out, ease.in, "easeOut", "easeInOut"],
            },
          ),
          animate(
            "[data-part=ear-left]",
            { scaleY: [1, 1, 0.78, 1.1, 0.96, 1], rotate: [0, 0, 0, -14, 4, 0] },
            { duration: seconds, times: [0, 0.15, 0.4, 0.62, 0.8, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=ear-right]",
            { scaleY: [1, 1, 0.78, 1.1, 0.96, 1], rotate: [0, 0, 0, 16, -4, 0] },
            { duration: seconds, times: [0, 0.15, 0.4, 0.66, 0.86, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // one ear flops over and bounces on its fold, the other twitches, then the floppy one springs back up
    flop: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=ear-right]",
            { rotate: [0, 62, 44, 58, 58, -8, 0] },
            {
              duration: seconds,
              times: [0, 0.18, 0.3, 0.42, 0.66, 0.82, 1],
              ease: [ease.in, "easeOut", "easeInOut", "linear", ease.out, "easeInOut"],
            },
          ),
          animate(
            "[data-part=ear-left]",
            { rotate: [0, 0, -12, 0, 0] },
            { duration: seconds, times: [0, 0.46, 0.52, 0.6, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=eye]",
            { scaleY: [1, 1, 0.15, 1, 1] },
            { duration: seconds, times: [0, 0.48, 0.53, 0.6, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the ears swivel like dishes, each turning edge-on and back in turn, while the face glances to
    // the side the ears are listening to
    listen: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=ear-left]",
            { scaleX: [1, 0.15, 1, 1, 1], rotate: [0, -8, 0, 0, 0] },
            { duration: seconds, times: [0, 0.18, 0.36, 0.7, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=ear-right]",
            { scaleX: [1, 1, 0.15, 1, 1], rotate: [0, 0, 8, 0, 0] },
            { duration: seconds, times: [0, 0.36, 0.54, 0.72, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=face]",
            { x: [0, -1.5, -1.5, 1.5, 1.5, 0] },
            { duration: seconds, times: [0, 0.16, 0.34, 0.5, 0.72, 0.9], ease: "easeInOut" },
          ),
          animate(
            "[data-part=nose]",
            { scale: [1, 1, 1.35, 1, 1.35, 1] },
            { duration: seconds, times: [0, 0.76, 0.81, 0.86, 0.91, 0.96], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="rabbit" style={pivot("50% 100%")}>
      <path d={HEAD} />
      {/* each ear pivots on the middle of its base, so both base ends stay on the head's top edge */}
      <path data-part="ear-left" d="M9 11 7 3h3l1 8" style={pivot("75% 100%")} />
      {/* the right ear flops from its outer base corner, so it folds away from the head, never into it */}
      <path data-part="ear-right" d="M13 11l1-8h3l-2 8" style={pivot("50% 100%")} />
      <g data-part="face" fill={slot.accent} stroke="none">
        <rect data-part="eye" x="8" y="13" width="2" height="2" style={pivot("50% 50%")} />
        <rect data-part="eye" x="14" y="13" width="2" height="2" style={pivot("50% 50%")} />
        <path data-part="nose" d="M10.5 17h3L12 19z" style={pivot("50% 50%")} />
      </g>
    </g>
  ),
})
