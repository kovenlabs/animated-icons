"use client";

import { createAnimatedIcon } from "../lib/create-icon";
import { pivot, slot } from "../lib/motion";

declare module "../lib/types" {
  interface IconVariants {
    handbag: "swing" | "twirl" | "plop";
  }
}

/** 2 colors: bag (primary), handle and clasp (accent). */
export const Handbag = createAnimatedIcon({
  name: "handbag",
  category: "commerce",
  keywords: [
    "purse",
    "bag",
    "fashion",
    "accessory",
    "tote",
    "boutique",
    "shopping",
    "luxury",
  ],
  slots: { primary: "bag", accent: "handle + clasp" },
  defaultVariant: "swing",
  variants: {
    // hung on the arm: it swings wide from its handle and the bag skews behind the swing
    swing: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=carry]",
          { rotate: [0, 20, -15, 9, -4, 0], skewX: [0, -6, 5, -3, 1, 0] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    // twirled on its handle: it turns edge-on, shows its plain back (no clasp) and comes round again
    twirl: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=carry]",
            { scaleX: [1, -1, 1], y: [0, -2, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=clasp]",
            { opacity: [1, 1, 0, 0, 1, 1] },
            {
              duration: seconds,
              times: [0, 0.24, 0.26, 0.74, 0.76, 1],
              ease: "linear",
            },
          ),
        ]),
    },
    // dropped on a counter: it rises stretched, lands with a wide squash, and the handle springs
    plop: {
      duration: 850,
      run: ({ animate, seconds }) => {
        const options = {
          duration: seconds,
          times: [0, 0.35, 0.6, 0.8, 1],
          ease: "easeInOut" as const,
        };
        return Promise.all([
          animate(
            "[data-part=bag]",
            {
              y: [0, -3, 0, 0, 0],
              scaleY: [1, 1.05, 0.78, 1.06, 1],
              scaleX: [1, 0.94, 1.18, 0.97, 1],
            },
            options,
          ),
          animate(
            "[data-part=handle]",
            { scaleY: [1, 1.1, 0.7, 1.15, 1] },
            options,
          ),
        ]);
      },
    },
  },
  render: () => (
    <g data-part="carry" style={pivot("50% 0%")}>
      <g data-part="bag" style={pivot("50% 100%")}>
        {/* a chamfered handle standing on the bag's top edge */}
        <path
          data-part="handle"
          d="M8 10V7l2-3h4l2 3v3"
          stroke={slot.accent}
          style={pivot("50% 100%")}
        />
        {/* a bag that flares out to its base */}
        <path d="M5 10h14l3 11H2Z" />
        <path
          data-part="clasp"
          d="M11 13h2v2h-2Z"
          fill={slot.accent}
          stroke="none"
          style={pivot("50% 50%")}
        />
      </g>
    </g>
  ),
});
