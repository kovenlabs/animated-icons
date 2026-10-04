"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import type { VariantContext } from "../lib/types"
import { ease, flash, pivot, radial, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    heart: "beat" | "fill" | "burst"
  }
}

/** A faceted heart: 45° flanks, flat-topped lobes, a right-angled notch and point. */
const HEART = "M12 20.5 3 11.5v-4L6.5 4h2L12 7.5 15.5 4h2L21 7.5v4Z"

const PARTICLES = radial(6, 8, -90)

/** A few square sparks drift out from the heart and fade. */
function sparkle({ animate, seconds }: VariantContext, delay: number) {
  return PARTICLES.map(({ x, y }, i) =>
    animate(
      `[data-particle="${i}"]`,
      { x: [0, x], y: [0, y], opacity: [0, 1, 0], scale: [0.6, 1, 0.6] },
      { duration: seconds * 0.7, delay, ease: "easeOut" },
    ),
  )
}

/** 2 colors: outline (primary), fill and particles (accent). */
export const Heart = createAnimatedIcon({
  name: "heart",
  category: "actions",
  keywords: ["like", "favorite", "love", "save", "health", "wishlist"],
  slots: { primary: "outline", accent: "fill + particles" },
  defaultVariant: "beat",
  variants: {
    // lub-dub
    beat: {
      duration: 700,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=heart]",
            { scale: [1, 1.12, 1, 1.07, 1] },
            { duration: seconds, times: [0, 0.15, 0.3, 0.45, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=fill]",
            { scale: [0.55, 0.75, 0.55, 0.7, 0.55] },
            { duration: seconds, times: [0, 0.15, 0.3, 0.45, 1] },
          ),
        ]),
    },
    fill: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=fill]",
          { scale: [0.55, 1, 1, 0.55] },
          { duration: seconds, times: [0, 0.35, 0.65, 1], ease: ease.out },
        ),
    },
    burst: {
      duration: 750,
      run: (ctx) =>
        Promise.all([
          ctx.animate(
            "[data-part=heart]",
            { scale: [1, 0.92, 1.1, 1] },
            { duration: ctx.seconds * 0.6, ease: ease.out },
          ),
          ...sparkle(ctx, ctx.seconds * 0.2),
        ]),
    },
  },
  render: () => (
    <>
      <g fill={slot.accent} stroke="none">
        {PARTICLES.map((_, i) => (
          <rect key={i} data-particle={i} x="11" y="10.5" width="2" height="2" style={flash()} />
        ))}
      </g>
      <g data-part="heart" style={pivot("50% 50%")}>
        <path
          data-part="fill"
          d={HEART}
          fill={slot.accent}
          stroke="none"
          style={{ ...pivot("50% 45%"), transform: "scale(0.55)" }}
        />
        <path d={HEART} />
      </g>
    </>
  ),
})
