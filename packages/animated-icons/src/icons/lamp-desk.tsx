"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "lamp-desk": "click" | "hop" | "look"
  }
}

/** 2 colors: base and arms (primary), shade and light (accent). */
export const LampDesk = createAnimatedIcon({
  name: "lamp-desk",
  family: "lamp",
  category: "devices",
  keywords: ["desk lamp", "architect lamp", "anglepoise", "reading light", "task light", "study", "office", "lighting"],
  slots: { primary: "base + arms", accent: "shade + light" },
  defaultVariant: "click",
  variants: {
    // switched on: the shade ducks hard on its hinge, the lamp sags, both spring back and light bursts out twice
    click: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=head]",
            { rotate: [0, 26, -5, 3, 0], scaleX: [1, 0.86, 1.04, 0.98, 1], scaleY: [1, 1.1, 0.95, 1.02, 1] },
            { duration: seconds * 0.75, times: [0, 0.2, 0.45, 0.7, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=lamp]",
            { scaleY: [1, 0.92, 1.03, 1], scaleX: [1, 1.04, 0.99, 1] },
            { duration: seconds * 0.6, times: [0, 0.3, 0.65, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=ray]",
            { opacity: [0, 1, 0, 1, 0], scale: [0.4, 1.15, 0.5, 1.2, 1] },
            { duration: seconds * 0.5, delay: seconds * 0.5, times: [0, 0.25, 0.5, 0.75, 1], ease: "easeOut" },
          ),
        ]),
    },
    // a Luxo hop: it crouches with its head bowed, springs up looking skyward, and lands in a squash
    hop: {
      duration: 1100,
      run: ({ animate, seconds }) => {
        const times = [0, 0.22, 0.45, 0.66, 0.82, 1]
        return Promise.all([
          animate(
            "[data-part=lamp]",
            {
              y: [0, 0, -2.5, 0, 0, 0],
              scaleY: [1, 0.84, 1.02, 0.86, 1.03, 1],
              scaleX: [1, 1.07, 0.97, 1.07, 0.99, 1],
            },
            { duration: seconds, times, ease: ["easeOut", ease.out, ease.in, "easeOut", "easeInOut"] },
          ),
          animate(
            "[data-part=head]",
            { rotate: [0, 20, -12, 18, -4, 0] },
            { duration: seconds, times, ease: "easeInOut" },
          ),
        ])
      },
    },
    // it swivels round on its base to peer the other way, nods twice at what it finds, and turns back
    look: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=turn]",
            { scaleX: [1, -1, -1, 1] },
            { duration: seconds, times: [0, 0.28, 0.72, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=head]",
            { rotate: [0, 0, 22, 2, 18, 0, 0] },
            { duration: seconds, times: [0, 0.3, 0.4, 0.5, 0.6, 0.7, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="turn" style={pivot("50% 50%")}>
      <g data-part="lamp" style={pivot("28% 100%")}>
        {/* a flat base, a lower arm leaning back to the elbow and an upper arm reaching forward to the shade */}
        <path d="M3 21h10M8 21 5 12l7-7" />
        {/* a conical shade hung from its hinge at the arm's tip, mouth turned down towards the desk */}
        <g data-part="head" stroke={slot.accent} style={pivot("0% 0%")}>
          <path d="M12 5l9 3.5-6.5 5.5Z" />
          <path data-part="ray" d="M16 18l1 2" style={flash("0% 0%")} />
          <path data-part="ray" d="M20.5 14.5l1 2" style={flash("0% 0%")} />
        </g>
      </g>
    </g>
  ),
})
