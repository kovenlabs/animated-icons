"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    rat: "scurry" | "sniff" | "swish"
  }
}

/** Crouched side-on, facing right: a flat belly, a rounded back and a long pointed snout. */
const BODY = "M5 16h11l3-2 3-1-3-3-3-2h-3l-4 1-4 3-1 2z"

/** A rounded ear standing on the back of the head, open at its base, which the head closes. */
const EAR = "M13 8 11 5l2-2h3l1 3-1 2"

/**
 * The tail leaves the rump and trails along the ground, 2px under the belly. It hinges on the rump and
 * only swings down and out, away from the body, never up into the belly.
 */
const TAIL = "M4.5 15 2 18h7l3 2"

/** 2 colors: body and ear (primary), eye and tail (accent). */
export const Rat = createAnimatedIcon({
  name: "rat",
  category: "nature",
  keywords: ["mouse", "rodent", "animal", "pest", "vermin", "pet", "sewer", "lab rat"],
  slots: { primary: "body + ear", accent: "eye + tail" },
  defaultVariant: "scurry",
  variants: {
    // it bolts out of the right edge with its body bobbing at a gallop, pops in from the left edge and
    // skids to a stop, the tail whipping behind
    scurry: {
      duration: 1200,
      clip: true,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=rat]",
            { x: [0, 20, -20, 0] },
            { duration: seconds, times: [0, 0.42, 0.43, 1], ease: [ease.in, snap, ease.out] },
          ),
          animate(
            "[data-part=body]",
            { rotate: [0, -6, 2, -6, 2, -4, 0, 0], scaleY: [1, 1.08, 0.92, 1.08, 0.92, 1.04, 0.96, 1] },
            { duration: seconds, times: [0, 0.12, 0.24, 0.36, 0.56, 0.7, 0.84, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=tail]",
            { rotate: [0, 14, 0, 10, 0, 14, -2, 0] },
            { duration: seconds, times: [0, 0.12, 0.24, 0.36, 0.56, 0.72, 0.88, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // it rears up on its haunches and sniffs the air: the snout stretches forward in quick twitches and the
    // ear flicks back, then it drops back down and blinks
    sniff: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=body]",
            { rotate: [0, -12, -12, -12, -12, 0, 0] },
            { duration: seconds, times: [0, 0.16, 0.3, 0.5, 0.66, 0.82, 1], ease: ["easeOut", "linear", "linear", "linear", ease.overshoot, "linear"] },
          ),
          animate(
            "[data-part=head]",
            { scaleX: [1, 1, 1.08, 1, 1.08, 1, 1.06, 1, 1] },
            { duration: seconds, times: [0, 0.18, 0.25, 0.32, 0.39, 0.46, 0.53, 0.6, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=ear]",
            { rotate: [0, 0, -18, 0, 0] },
            { duration: seconds, times: [0, 0.2, 0.32, 0.5, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=eye]",
            { scaleY: [1, 1, 0.15, 1] },
            { duration: seconds, times: [0, 0.86, 0.92, 0.98], ease: "easeInOut" },
          ),
        ]),
    },
    // the tail lashes out and back like a whip, a stretched crack and two smaller cracks after it, while the
    // body flinches forward on each one
    swish: {
      duration: 1200,
      run: ({ animate, seconds }) => {
        const times = [0, 0.16, 0.32, 0.48, 0.62, 0.8, 1]
        return Promise.all([
          animate(
            "[data-part=tail]",
            { rotate: [0, 16, -3, 10, 0, 5, 0], scaleX: [1, 1.08, 0.96, 1.05, 1, 1.02, 1] },
            { duration: seconds, times, ease: "easeInOut" },
          ),
          animate(
            "[data-part=body]",
            { x: [0, 0.8, 0, 0.5, 0, 0.3, 0] },
            { duration: seconds, times, ease: "easeInOut" },
          ),
        ])
      },
    },
  },
  render: () => (
    <g data-part="rat" style={pivot("50% 100%")}>
      {/* the body rears on its rump at (5, 16), in a box of x 2..22, y 3..20 */}
      <g data-part="body" style={pivot("15% 76%")}>
        {/* the head stretches its snout from the rump (its low back corner), carrying the ear along */}
        <g data-part="head" style={pivot("0% 100%")}>
          <path d={BODY} />
          <rect data-part="eye" x="15" y="11" width="2" height="2" fill={slot.accent} stroke="none" style={pivot("50% 50%")} />
          {/* the ear tips back from the middle of its base */}
          <path data-part="ear" d={EAR} style={pivot("50% 100%")} />
        </g>
        {/* the tail's box is x 2..12, y 15..20: it hinges where it leaves the rump, at (4.5, 15) */}
        <path data-part="tail" d={TAIL} stroke={slot.accent} style={pivot("25% 0%")} />
      </g>
    </g>
  ),
})
