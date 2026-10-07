"use client"

import type { Easing } from "motion/react"

import { useId } from "react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot, snap } from "../lib/motion"
import { useShapedDrawing } from "../lib/shape"

declare module "../lib/types" {
  interface IconVariants {
    tablet: "rotate" | "flip" | "swipe"
  }
}

/** The screen's inside: the body is 4..20 × 2..22, so its stroke's inner edge sits at 5..19 × 3..21. */
const SCREEN = { x: 5, y: 3, width: 14, height: 18 }

/** Three lines of text in a 6 × 6 box centred on (12, 11), so the page can turn on its own centre. */
const LINES = ["M9 8h6", "M9 11h6", "M9 14h3"]

/**
 * The page sits inside a clip of the screen's inner edge, so a page swiped off the screen slips under
 * the frame instead of crossing its stroke. The clip lives inside the body, so it turns with it.
 */
function Drawing() {
  const clip = `tablet-${useId().replace(/[^\w-]/g, "")}`
  // drawn in its own component (for the clip id), so it shapes its corners from context
  return useShapedDrawing(
    <>
      <clipPath id={clip}>
        <rect {...SCREEN} />
      </clipPath>
      {/* the whole device: turns into landscape, lifts toward you */}
      <g data-part="tablet" style={pivot("50% 50%")}>
        {/* the slab spun on its upright axis: squeezing its width through zero reads as a turn */}
        {/* the slab's edge, seen only while it is turned side-on */}
        <path data-part="edge" d="M12 2v20" style={flash()} />
        <g data-part="turn" style={pivot("50% 50%")}>
          <path d="M4 2h16v20H4Z" />
          <g data-part="front">
            <g clipPath={`url(#${clip})`}>
              <g data-part="page" stroke={slot.accent} style={pivot("50% 50%")}>
                {LINES.map((d) => (
                  <path key={d} d={d} />
                ))}
              </g>
            </g>
            <path d="M11 18h2" />
          </g>
          {/* the back: a camera bump, drawn mirrored so it lands top-left once the slab has turned */}
          <rect data-part="back" x="14" y="5" width="3" height="3" fill={slot.accent} stroke="none" style={flash()} />
        </g>
      </g>
    </>,
  )
}

/** Face swap at the moment the slab is edge-on (scaleX 0), held hidden while its back faces you. */
const FACE = { times: [0, 0.25, 0.251, 0.75, 0.751, 1], ease: ["linear", snap, "linear", snap, "linear"] satisfies Easing[] }

/** The slab's edge, shown around the moments it is edge-on, so the turn has thickness. */
const EDGE = { times: [0, 0.18, 0.25, 0.32, 0.68, 0.75, 0.82, 1] }
const EDGE_ON = [0, 0, 1, 0, 0, 1, 0, 0]

/** 2 colors: body + home bar (primary), screen page and camera (accent). */
export const Tablet = createAnimatedIcon({
  name: "tablet",
  category: "devices",
  keywords: ["ipad", "device", "screen", "portable", "landscape", "rotate", "touchscreen", "kindle"],
  slots: { primary: "body + home bar", accent: "screen page + camera" },
  defaultVariant: "rotate",
  variants: {
    // turned into landscape, dipping a little as it swings; a beat later the page swings itself
    // upright again, then the tablet turns back and the page follows
    rotate: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=tablet]",
            { rotate: [0, 90, 90, 0, 0] },
            { duration: seconds, times: [0, 0.3, 0.55, 0.82, 1], ease: ["easeInOut", "linear", "easeInOut", "linear"] },
          ),
          animate(
            "[data-part=turn]",
            { scaleX: [1, 0.86, 1, 1, 0.86, 1, 1], scaleY: [1, 0.86, 1, 1, 0.86, 1, 1] },
            { duration: seconds, times: [0, 0.15, 0.3, 0.55, 0.685, 0.82, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=page]",
            { rotate: [0, 0, -90, -90, 0] },
            { duration: seconds, times: [0, 0.32, 0.5, 0.84, 1], ease: ["linear", ease.overshoot, "linear", ease.overshoot] },
          ),
        ]),
    },
    // spun a full turn on its upright axis, lifting toward you: the screen gives way to the camera
    // on the back while it faces away
    flip: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=turn]",
            { scaleX: [1, 0, -1, 0, 1] },
            { duration: seconds, times: [0, 0.25, 0.5, 0.75, 1], ease: ["easeIn", "easeOut", "easeIn", "easeOut"] },
          ),
          animate(
            "[data-part=tablet]",
            { y: [0, -1.5, 0], scale: [1, 1.12, 1] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate("[data-part=front]", { opacity: [1, 1, 0, 0, 1, 1] }, { duration: seconds, ...FACE }),
          animate("[data-part=back]", { opacity: [0, 0, 1, 1, 0, 0] }, { duration: seconds, ...FACE }),
          animate("[data-part=edge]", { opacity: EDGE_ON }, { duration: seconds, ...EDGE }),
        ]),
    },
    // a page is swiped off to the left under the frame and the next slides in from the right
    // (a long move, but clipped by the screen, inside the frame)
    swipe: {
      clip: false,
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=page]",
            { x: [0, -11, 11, 0] },
            { duration: seconds, times: [0, 0.4, 0.55, 1], ease: ["easeIn", "linear", ease.overshoot] },
          ),
          // invisible only for the jump back to the right, while it is off the screen anyway
          animate(
            "[data-part=page]",
            { opacity: [1, 1, 0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.39, 0.4, 0.55, 0.56, 1] },
          ),
        ]),
    },
  },
  render: () => <Drawing />,
})
