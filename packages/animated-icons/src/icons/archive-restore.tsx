"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "archive-restore": "restore" | "draw" | "tilt"
  }
}

/** 2 colors: box and lid (primary), restore arrow (accent). */
export const ArchiveRestore = createAnimatedIcon({
  name: "archive-restore",
  family: "archive",
  category: "files",
  keywords: ["unarchive", "restore", "recover", "bring back", "unpack", "retrieve", "undo archive"],
  slots: { primary: "box + lid", accent: "restore arrow" },
  defaultVariant: "restore",
  variants: {
    // the lid tips open (edge-on), the arrow crouches and launches up out of the box, fades, the lid
    // slams shut with a jolt and the arrow springs back up in place
    restore: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=lid]",
            { scaleY: [1, 0.3, 0.3, 1, 1], skewX: [0, -12, -12, 0, 0] },
            { duration: seconds, times: [0, 0.18, 0.55, 0.68, 1], ease: ["easeOut", "linear", "easeIn", "linear"] },
          ),
          animate(
            "[data-part=archive]",
            { scaleY: [1, 1, 0.93, 1] },
            { duration: seconds, times: [0, 0.68, 0.76, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=arrow]",
            {
              y: [0, 1, -4, -4, 0, 0, 0],
              scaleY: [1, 0.8, 1.08, 1, 0, 1.05, 1],
              opacity: [1, 1, 1, 0, 0, 1, 1],
            },
            {
              duration: seconds,
              times: [0, 0.15, 0.32, 0.45, 0.7, 0.88, 1],
              ease: ["easeOut", ease.in, "easeOut", "linear", ease.overshoot, "easeOut"],
            },
          ),
        ]),
    },
    // the arrow is wiped, its shaft draws up out of the box and the head snaps on at the top
    draw: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          // hidden until it has length: a square cap paints a dot at pathLength 0
          animate(
            "[data-part=shaft]",
            { opacity: [1, 0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.12, 0.2, 0.21, 1] },
          ),
          animate(
            "[data-part=shaft]",
            { pathLength: [1, 1, 0, 1, 1] },
            { duration: seconds, times: [0, 0.19, 0.2, 0.55, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=head]",
            { opacity: [1, 0, 0, 1, 1], scale: [1, 1, 0, 1.3, 1] },
            { duration: seconds, times: [0, 0.12, 0.5, 0.7, 1], ease: ["linear", "linear", ease.overshoot, "easeOut"] },
          ),
        ]),
    },
    // the archive turns left then right in perspective, the arrow floating in front with parallax
    tilt: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=archive]",
            { scaleX: [1, 0.88, 1, 0.88, 1], skewY: [0, -6, 0, 6, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate("[data-part=arrow]", { x: [0, -1.5, 0, 1.5, 0] }, { duration: seconds, ease: "easeInOut" }),
        ]),
    },
  },
  render: () => (
    <g data-part="archive" style={pivot("50% 100%")}>
      {/* the box, open at the bottom middle where the arrow comes out */}
      <path d="M8 21H4V8M16 21h4V8" />
      {/* the lid overhangs the box by 2 each side and opens from its back edge */}
      <path data-part="lid" d="M2 3h20v5H2z" style={pivot("50% 0%")} />
      <g data-part="arrow" stroke={slot.accent} style={pivot("50% 100%")}>
        <path data-part="shaft" d="M12 21v-9" />
        <path data-part="head" d="M9 15l3-3 3 3" style={pivot("50% 0%")} />
      </g>
    </g>
  ),
})
