/**
 * Fake 3D for a flat object turning about its vertical axis (a coin spun on its edge, a sticker turned
 * over). SVG flattens `rotateY`, so the turn is played as `scaleX = cos(angle)`, keyed at every quarter
 * turn: face, edge, back, edge, face. Each quarter eases the way a cosine does, slow at the faces and
 * fast through the edges.
 */

/** When each quarter turn lands, for a turn's angle over its progress. */
const profiles = {
  /** Thrown spinning and slowing down, like a coin on a table. */
  out: (p: number) => 1 - (1 - p) ** (1 / 1.6),
  /** Winds up and winds down again. */
  inOut: (p: number) => Math.acos(1 - 2 * p) / Math.PI,
}

/** Keyframes for `turns` whole turns, so the last key is the face at rest. */
export function spin(turns: number, profile: keyof typeof profiles = "out") {
  const quarters = turns * 4
  const keys = Array.from({ length: quarters + 1 }, (_, i) => i)
  return {
    scaleX: keys.map((i) => [1, 0, -1, 0][i % 4]!),
    /** Opacity for a rim drawn only while the face is side-on: lit exactly as scaleX passes 0. */
    edge: keys.map((i) => i % 2),
    times: keys.map((i) => profiles[profile](i / quarters)),
    ease: keys.slice(1).map((i) => (i % 2 ? "easeIn" : "easeOut") as "easeIn" | "easeOut"),
  }
}
