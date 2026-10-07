/**
 * Parametric parts shared by composite icons. Each builder returns path data drawn at its real size,
 * never scaled, so every stroke in a composite stays 2px.
 */

/**
 * A square speech bubble with a raked, pointed tail. (x, y) is the top-left corner, w × h the body;
 * the tail hangs 4 below the body. `bubble(3, 4, 18, 12)` is exactly the `message` icon.
 */
export function bubble(x: number, y: number, w: number, h: number, tail: "left" | "right" = "left") {
  const half = w / 2
  return tail === "left"
    ? `M${x} ${y}h${w}v${h}H${x + half}l${-(half - 3)} 4v-4H${x}Z`
    : `M${x + w} ${y}H${x}v${h}H${x + half}l${half - 3} 4v-4H${x + w}Z`
}

/** Top-left corners of three 2×2 typing dots centred on (cx, cy), `gap` apart. */
export function dots(cx: number, cy: number, gap = 4) {
  return [-1, 0, 1].map((i) => ({ x: cx - 1 + i * gap, y: cy - 1 }))
}

/**
 * The top-right badge zone (14..22 × 2..10). A base icon that takes a modifier leaves this corner
 * open, like `mail` does for its badge; the modifier is drawn inside it.
 */
export const BADGE = { cx: 18, cy: 6, size: 8 } as const

/** Modifier glyphs sized for the badge zone, centred on (cx, cy): the badge centre by default, anywhere else too. */
export const badgeGlyph = {
  check: (cx: number = BADGE.cx, cy: number = BADGE.cy) => `M${cx - 2.5} ${cy}l1.75 1.75 3.25-3.5`,
  plus: (cx: number = BADGE.cx, cy: number = BADGE.cy) => `M${cx} ${cy - 3}v6M${cx - 3} ${cy}h6`,
  minus: (cx: number = BADGE.cx, cy: number = BADGE.cy) => `M${cx - 3} ${cy}h6`,
  x: (cx: number = BADGE.cx, cy: number = BADGE.cy) => `M${cx - 2.5} ${cy - 2.5}l5 5M${cx + 2.5} ${cy - 2.5}l-5 5`,
}

/**
 * A faceted rosette filling the frame: eight points on a radius-10 circle, notched 2px in between (radius 8),
 * so it reads as the scalloped seal at any corner style. The `badge-*` icons are drawn on it.
 */
export const ROSETTE =
  "M12 2 15.061 4.609 19.071 4.929 19.391 8.939 22 12 19.391 15.061 19.071 19.071 15.061 19.391 12 22 8.939 19.391 4.929 19.071 4.609 15.061 2 12 4.609 8.939 4.929 4.929 8.939 4.609Z"

/** A diagonal slash across the whole icon, for "off" states. */
export const SLASH = "M3 3l18 18"
