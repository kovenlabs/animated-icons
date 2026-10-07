/** Authoring kit for icon definitions: color slots, pivots, accents and easings. */

/**
 * Stroke/fill values for each color slot. A missing slot falls back to the nearest one above it
 * (accent → secondary → primary → currentColor), so defining one variable paints the whole icon.
 */
export const slot = {
  primary: "var(--icon-primary, currentColor)",
  secondary: "var(--icon-secondary, var(--icon-primary, currentColor))",
  accent: "var(--icon-accent, var(--icon-secondary, var(--icon-primary, currentColor)))",
} as const

/**
 * Where a part rotates/scales from, relative to its own bounding box.
 * motion forces `transform-box: fill-box` on animated SVG parts, so we match it.
 */
export function pivot(origin: string): React.CSSProperties {
  return { transformBox: "fill-box", transformOrigin: origin }
}

/** An accent that only exists in motion (sparks, sound waves, particles): invisible at rest. */
export function flash(origin = "50% 50%"): React.CSSProperties {
  return { ...pivot(origin), opacity: 0 }
}

/** Keyframes for an accent that blinks in and back out (pair with `flash()` styling). */
export const blink = { opacity: [0, 1, 0], scale: [0.6, 1, 1.1] }

export const ease = {
  /** Fast start, long settle (expo out): most entrances. */
  out: [0.16, 1, 0.3, 1],
  /** Overshoots its target then settles: pops, landings. */
  overshoot: [0.34, 1.56, 0.64, 1],
  /** Slow wind-up, violent finish: launches, throws. */
  in: [0.7, 0, 0.84, 0],
  inOut: [0.65, 0, 0.35, 1],
} as const satisfies Record<string, readonly [number, number, number, number]>

/**
 * Easing for a snap-back segment: holds the previous keyframe and jumps to the next only at the
 * segment's very end, so no in-between pose is ever drawn. Being a function, it also keeps the track
 * on motion's frame loop (WAAPI can't run it), so every track that snaps lands on the same frame;
 * a WAAPI opacity track would otherwise start blending a frame or two before a frame-loop transform
 * snaps, and the icon flickers as it finishes. Use it for the last segment of a loop whose end pose
 * looks like rest: `times: [0, 0.999, 1], ease: ["easeInOut", snap]`.
 */
export const snap = (progress: number) => (progress < 1 ? 0 : 1)

/** Evenly spaced points on a circle, for particle bursts. */
export function radial(count: number, distance: number, offsetDeg = 0) {
  return Array.from({ length: count }, (_, i) => {
    const angle = ((360 / count) * i + offsetDeg) * (Math.PI / 180)
    return { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance }
  })
}
