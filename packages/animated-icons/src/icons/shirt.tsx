"use client";

import { createAnimatedIcon } from "../lib/create-icon";
import { pivot, slot } from "../lib/motion";

declare module "../lib/types" {
  interface IconVariants {
    shirt: "flap" | "sway" | "flip";
  }
}

/** 2 colors: shirt (primary), collar (accent). */
export const Shirt = createAnimatedIcon({
  name: "shirt",
  category: "commerce",
  keywords: [
    "t-shirt",
    "tee",
    "clothing",
    "apparel",
    "fashion",
    "wear",
    "garment",
    "merch",
  ],
  slots: { primary: "shirt", accent: "collar" },
  defaultVariant: "flap",
  variants: {
    // the shirt bounces and both sleeves fling up from the shoulders, flap again and drop back
    flap: {
      duration: 900,
      run: ({ animate, seconds }) => {
        const options = {
          duration: seconds,
          times: [0, 0.3, 0.55, 0.78, 1],
          ease: "easeInOut" as const,
        };
        return Promise.all([
          animate(
            "[data-part=sleeve-left]",
            { rotate: [0, 18, 4, 12, 0] },
            options,
          ),
          animate(
            "[data-part=sleeve-right]",
            { rotate: [0, -18, -4, -12, 0] },
            options,
          ),
          animate(
            "[data-part=shirt]",
            { y: [0, -1, 0.5, -0.5, 0], scaleY: [1, 1.03, 0.92, 1.02, 1] },
            options,
          ),
        ]);
      },
    },
    // on a hanger: it swings from the collar and the cloth skews behind the swing
    sway: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=hanger]",
          { rotate: [0, 14, -11, 6, -2, 0], skewX: [0, -5, 4, -2, 0.5, 0] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    // turned round to show its back: it lifts, flips edge-on, the neckline flattens on the back side,
    // and it comes round to face you
    flip: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=shirt]",
            { scaleX: [1, -1, 1], y: [0, -1.5, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=collar]",
            { scaleY: [1, 1, 0.35, 0.35, 1, 1] },
            {
              duration: seconds,
              times: [0, 0.22, 0.3, 0.7, 0.78, 1],
              ease: "easeInOut",
            },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="hanger" style={pivot("50% 0%")}>
      <g data-part="shirt" style={pivot("50% 100%")}>
        {/* a straight body with sloped shoulders, open at the neck for the collar */}
        <path d="M9 3H8L6 4.5V21h12V4.5L16 3h-1" />
        {/* raked sleeves hinged at each shoulder */}
        <path
          data-part="sleeve-left"
          d="M6 4.5L2 7l1.5 4.5L6 10.5"
          style={pivot("100% 0%")}
        />
        <path
          data-part="sleeve-right"
          d="M18 4.5l4 2.5-1.5 4.5-2.5-1"
          style={pivot("0% 0%")}
        />
        <path
          data-part="collar"
          d="M9 3l3 3 3-3"
          stroke={slot.accent}
          style={pivot("50% 0%")}
        />
      </g>
    </g>
  ),
});
