"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    blocks: "drop" | "turn" | "hop"
  }
}

/** 2 colors: base blocks (primary), the top block (accent). */
export const Blocks = createAnimatedIcon({
  name: "blocks",
  category: "development",
  keywords: ["building blocks", "modules", "integrations", "apps", "extensions", "add-ons", "plugins", "stack"],
  slots: { primary: "base blocks", accent: "top block" },
  defaultVariant: "drop",
  variants: {
    // the top block is lifted clean out of the frame, showing the ledge it stood on, then drops back
    // in; the whole stack squashes under the impact and springs back
    drop: {
      duration: 1300,
      clip: true,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=top]",
            { y: [0, 0, -16, -16, 0, 0] },
            { duration: seconds, times: [0, 0.08, 0.32, 0.45, 0.68, 1], ease: ["easeOut", ease.in, "linear", ease.in, "linear"] },
          ),
          // stretched by the pull and by the fall
          animate(
            "[data-part=top]",
            { scaleY: [1, 0.92, 1.12, 1, 1.1, 1, 1] },
            { duration: seconds, times: [0, 0.08, 0.2, 0.45, 0.62, 0.68, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=stack]",
            { scaleY: [1, 1, 0.84, 1.05, 1], scaleX: [1, 1, 1.06, 0.98, 1] },
            { duration: seconds, times: [0, 0.68, 0.76, 0.88, 1], ease: ["linear", ease.out, "easeInOut", "easeInOut"] },
          ),
          // the ledge under the top block: shown once the block has cleared it, gone as it lands back
          animate(
            "[data-part=under]",
            { opacity: [0, 0, 1, 1, 0, 0] },
            { duration: seconds, times: [0, 0.14, 0.15, 0.66, 0.67, 1], ease: ["linear", snap, "linear", snap, "linear"] },
          ),
        ]),
    },
    // the stack turns a full circle about its vertical axis, its depth swinging from one side to the
    // other as it goes round
    turn: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=stack]",
          { scaleX: [1, 0, -1, 0, 1], scaleY: [1, 1.08, 1, 1.08, 1] },
          { duration: seconds, ease: ["easeIn", "easeOut", "easeIn", "easeOut"] },
        ),
    },
    // the stack hops; the top block flies a little higher and lands a beat later, each with a squash
    hop: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=stack]",
            { y: [0, -2.5, 0, 0], scaleY: [1, 1.06, 0.9, 1] },
            { duration: seconds, times: [0, 0.35, 0.6, 1], ease: ["easeOut", "easeIn", "easeOut"] },
          ),
          // always above where it rests, so it never sinks into the base
          animate(
            "[data-part=top]",
            { y: [0, -2, 0, 0], scaleY: [1, 1, 0.88, 1] },
            { duration: seconds, times: [0, 0.45, 0.72, 1], ease: ["easeOut", "easeIn", "easeOut"] },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="stack" style={pivot("50% 100%")}>
      {/* two blocks side by side, seen from the front with their depth thrown up and to the right; only */}
      {/* the edges the top block leaves in view are drawn */}
      <path d="M2 14h16v8H2zM10 14v8M2 14l4-4h4M18 14l4-4v8l-4 4" />
      {/* the ledge the top block hides: the base's back edge and the seam across its top */}
      <path data-part="under" d="M10 10h12M10 14l4-4" style={flash()} />
      {/* the top block sits on the right one, flush with the base's front and side */}
      <path
        data-part="top"
        d="M10 6h8v8h-8zM10 6l4-4h8l-4 4M22 2v8l-4 4"
        stroke={slot.accent}
        style={pivot("50% 100%")}
      />
    </g>
  ),
})
