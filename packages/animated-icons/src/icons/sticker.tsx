"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    sticker: "peel" | "stick" | "wink"
  }
}

/**
 * The peeled corner folds over the diagonal from (15, 2) to (22, 9). It is drawn rotated so that
 * diagonal lies flat, and stretched on its own vertical axis: a scaleY then lifts or flattens the
 * flap square to its hinge, the corner flipping over it like real paper.
 */
const HINGE = "18.5 5.5"

/** 2 colors: sticker and face (primary), peeled corner (accent). */
export const Sticker = createAnimatedIcon({
  name: "sticker",
  category: "social",
  keywords: ["emoji", "decal", "label", "reaction", "smiley", "peel", "stickers"],
  slots: { primary: "sticker + face", accent: "peeled corner" },
  defaultVariant: "peel",
  variants: {
    // the corner flips flat onto the sticker's face, then curls back up and springs into place
    peel: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=peel]",
            { scaleY: [1, 0, -1, -1, 0, 1.1, 1] },
            { duration: seconds, times: [0, 0.15, 0.3, 0.55, 0.7, 0.85, 1], ease: ["easeIn", "easeOut", "linear", "easeIn", "easeOut", "easeInOut"] },
          ),
          animate(
            "[data-part=mouth]",
            { scale: [1, 1, 1.2, 1.2, 1] },
            { duration: seconds, times: [0, 0.3, 0.4, 0.75, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // slapped on from in front of the screen: it lands flat with a squash, then its corner curls up
    stick: {
      clip: true,
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=sticker]",
            { scale: [1.35, 0.9, 1.03, 1], opacity: [0, 1, 1, 1], rotate: [-12, 2, 0, 0] },
            { duration: seconds * 0.55, times: [0, 0.5, 0.75, 1], ease: [ease.in, "easeOut", "easeInOut"] },
          ),
          animate(
            "[data-part=peel]",
            { scaleY: [-1, -1, 0, 1.12, 1] },
            { duration: seconds, times: [0, 0.5, 0.68, 0.85, 1], ease: ["linear", "easeIn", "easeOut", "easeInOut"] },
          ),
        ]),
    },
    // the face winks and grins, the sticker giving a little squash with it
    wink: {
      duration: 900,
      run: ({ animate, seconds }) => {
        const timing = { duration: seconds, times: [0, 0.3, 0.65, 1], ease: "easeInOut" as const }
        return Promise.all([
          animate("[data-eye=right]", { scaleY: [1, 0.15, 0.15, 1] }, timing),
          animate("[data-part=mouth]", { scale: [1, 1.25, 1.25, 1], rotate: [0, -6, -6, 0] }, timing),
          animate("[data-part=sticker]", { scaleY: [1, 0.95, 1, 1], scaleX: [1, 0.98, 1, 1] }, timing),
        ])
      },
    },
  },
  render: () => (
    <g data-part="sticker" style={pivot("50% 50%")}>
      {/* a square with its top-right corner cut away where it peels */}
      <path d="M2 2h13l7 7v13H2Z" />
      <g fill={slot.primary} stroke="none">
        <rect data-part="eye" x="6.5" y="11.5" width="2" height="2" style={pivot("50% 50%")} />
        <rect data-part="eye" data-eye="right" x="11.5" y="11.5" width="2" height="2" style={pivot("50% 50%")} />
      </g>
      <path data-part="mouth" d="M6.5 16.5l1.5 1.5h4l1.5-1.5" style={pivot("50% 0%")} />
      <g transform={`rotate(45 ${HINGE})`}>
        <g data-part="peel" style={pivot("50% 0%")}>
          <path d="M15 2v7h7" stroke={slot.accent} transform={`rotate(-45 ${HINGE})`} />
        </g>
      </g>
    </g>
  ),
})
