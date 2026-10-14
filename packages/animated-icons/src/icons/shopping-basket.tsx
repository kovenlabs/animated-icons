"use client";

import { createAnimatedIcon } from "../lib/create-icon";
import { pivot, slot } from "../lib/motion";

declare module "../lib/types" {
  interface IconVariants {
    "shopping-basket": "hop" | "swing" | "spin";
  }
}

/** 2 colors: basket, rim and weave (primary), handle (accent). */
export const ShoppingBasket = createAnimatedIcon({
  name: "shopping-basket",
  family: "shopping",
  category: "commerce",
  keywords: [
    "basket",
    "shopping",
    "groceries",
    "cart",
    "buy",
    "market",
    "checkout",
    "add to basket",
  ],
  slots: { primary: "basket + rim + weave", accent: "handle" },
  defaultVariant: "hop",
  variants: {
    // crouches, springs up stretched with its handle whipping tall, and lands with a squash
    hop: {
      duration: 900,
      run: ({ animate, seconds }) => {
        const options = {
          duration: seconds,
          times: [0, 0.18, 0.45, 0.7, 0.85, 1],
          ease: "easeInOut" as const,
        };
        return Promise.all([
          animate(
            "[data-part=basket]",
            {
              y: [0, 1, -4, 0, 0, 0],
              scaleY: [1, 0.84, 1.12, 0.8, 1.05, 1],
              scaleX: [1, 1.1, 0.92, 1.16, 0.97, 1],
            },
            options,
          ),
          animate(
            "[data-part=handle]",
            { scaleY: [1, 0.8, 1.22, 0.72, 1.1, 1] },
            options,
          ),
        ]);
      },
    },
    // hung on an arm: it swings wide from the top of its handle, skewing in perspective as it goes
    swing: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=carry]",
          { rotate: [0, 18, -14, 8, -3, 0], skewX: [0, -6, 5, -3, 1, 0] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    // twirled round on its handle: it turns edge-on, shows its back and comes round to face you
    spin: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=carry]",
            { scaleX: [1, -1, 1], y: [0, -2, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=handle]",
            { scaleY: [1, 1.2, 0.9, 1] },
            { duration: seconds, times: [0, 0.4, 0.8, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    // swings and turns from the top of the handle; hops and squashes from the floor
    <g data-part="carry" style={pivot("50% 0%")}>
      <g data-part="basket" style={pivot("50% 100%")}>
        {/* a raked handle standing on the rim */}
        <path
          data-part="handle"
          d="M6 10l4-7h4l4 7"
          stroke={slot.accent}
          style={pivot("50% 100%")}
        />
        {/* the rim, a tapered open basket and one band of weave across it */}
        <path d="M2 10h20" />
        <path d="M4 10l2 10h12l2-10" />
        <path d="M5 15h14" />
      </g>
    </g>
  ),
});
