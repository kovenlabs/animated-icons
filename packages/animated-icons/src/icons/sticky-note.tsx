"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "sticky-note": "peel" | "slap" | "sway"
  }
}

/** 2 colors: note (primary), curled corner (accent). */
export const StickyNote = createAnimatedIcon({
  name: "sticky-note",
  category: "files",
  keywords: ["post-it", "memo", "note", "reminder", "sticker", "jot", "pin up"],
  slots: { primary: "note", accent: "curled corner" },
  defaultVariant: "peel",
  variants: {
    // the curled corner flips out over its crease as the note lifts off the pad, holds, and curls back
    // in with a little overshoot
    peel: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=flap]",
            { scaleY: [1, -1, -1, 1.2, 1] },
            { duration: seconds, times: [0, 0.35, 0.55, 0.8, 1], ease: ["easeInOut", "linear", ease.in, "easeOut"] },
          ),
          animate(
            "[data-part=note]",
            { scale: [1, 1.05, 1.05, 0.97, 1], rotate: [0, -4, -4, 1, 0], y: [0, -1, -1, 0, 0] },
            { duration: seconds, times: [0, 0.35, 0.55, 0.8, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // lifted toward you and slapped onto the wall: it squashes flat, and the corner flutters after it lands
    slap: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=note]",
            { scale: [1, 1.12, 0.9, 1.03, 1], rotate: [0, -3, 1, 0, 0], y: [0, 0, 0.5, 0, 0] },
            { duration: seconds, times: [0, 0.35, 0.55, 0.75, 1], ease: ["easeOut", ease.in, "easeOut", "easeInOut"] },
          ),
          animate(
            "[data-part=flap]",
            { scaleY: [1, 1, 0.2, 1.15, 0.7, 1] },
            { duration: seconds, times: [0, 0.55, 0.68, 0.8, 0.9, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // pinned at the top edge, it sways in a draught: the sheet skews like it is tilting in depth and the
    // loose corner lifts behind it
    sway: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=sheet]",
            { skewX: [0, 10, -7, 4, -1.5, 0], scaleY: [1, 0.95, 0.98, 0.99, 1, 1] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=flap]",
            { scaleY: [1, 0.3, 1.1, 0.6, 1, 1] },
            { duration: seconds, delay: seconds * 0.05, ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="sheet" style={pivot("50% 0%")}>
      <g data-part="note" style={pivot("50% 50%")}>
        {/* a square note, its bottom-right corner folded under along the diagonal */}
        <path d="M3 3h18v12l-6 6H3z" />
        {/* The crease (21 15 → 15 21) is laid flat by the outer turn, so the curl is a plain scaleY about it.
            An unpainted mirror of the flap keeps the crease at the centre of the part's box */}
        <g transform="rotate(-45 18 18)">
          <g data-part="flap" style={pivot("50% 50%")}>
            <g transform="rotate(45 18 18)">
              <path d="M21 15h-6v6" stroke={slot.accent} />
              <path d="M21 15v6h-6" stroke="none" />
            </g>
          </g>
        </g>
      </g>
    </g>
  ),
})
