/**
 * Fake 3D for solids on a turntable. SVG flattens `rotateX`/`rotateY`, and a part must never tween its
 * geometry, so a solid that turns is drawn as a stack of static poses (its visible edges at a few yaws)
 * and played as a flipbook: each pose is lit in turn by opacity alone.
 */

import { snap } from "./motion"

/** x to the right, y up, z towards the viewer. */
export type Point3 = readonly [x: number, y: number, z: number]

export interface Solid {
  vertices: readonly Point3[]
  /** Each face as a loop of vertex indices, wound either way. Leave a face out to leave the solid open there. */
  faces: readonly (readonly number[])[]
}

/** Where the solid's origin lands on the 24px grid, and how many degrees the camera looks down on it. */
export interface View {
  x: number
  y: number
  tilt: number
}

const rad = (deg: number) => (deg * Math.PI) / 180
const fmt = (n: number) => Number(n.toFixed(2)) || 0

/**
 * Turns a point `yaw` degrees about the vertical axis (a positive yaw swings the front to the right),
 * after rolling it `roll` degrees about the solid's own x axis (a positive roll tips the top towards you).
 */
function turn([x, y, z]: Point3, yaw: number, roll = 0): Point3 {
  const [cr, sr] = [Math.cos(rad(roll)), Math.sin(rad(roll))]
  ;[y, z] = [y * cr - z * sr, z * cr + y * sr]
  const [c, s] = [Math.cos(rad(yaw)), Math.sin(rad(yaw))]
  return [x * c + z * s, y, z * c - x * s]
}

/** Where a point lands on the grid with the solid turned `yaw` degrees (and rolled `roll`). */
export function project(point: Point3, yaw: number, view: View, roll = 0): [number, number] {
  const [x, y, z] = turn(point, yaw, roll)
  return [fmt(view.x + x), fmt(view.y - y * Math.cos(rad(view.tilt)) + z * Math.sin(rad(view.tilt)))]
}

/**
 * The edges a solid shows turned `yaw` degrees (those of the faces turned towards the camera), chained
 * into as few strokes as possible so each corner is a real join the factory can round.
 */
export function outline(solid: Solid, yaw: number, view: View, roll = 0): string {
  const turned = solid.vertices.map((v) => turn(v, yaw, roll))
  const centre = turned.reduce<number[]>((sum, v) => sum.map((c, i) => c + v[i]! / turned.length), [0, 0, 0])
  const camera = [0, Math.sin(rad(view.tilt)), Math.cos(rad(view.tilt))]
  const dot = (a: readonly number[], b: readonly number[]) => a.reduce((sum, n, k) => sum + n * b[k]!, 0)

  const edges = new Map<string, [number, number]>()
  for (const face of solid.faces) {
    // Newell's normal, flipped to point away from the solid's centre
    const normal = [0, 0, 0]
    const middle = [0, 0, 0]
    face.forEach((index, i) => {
      const a = turned[index]!
      const b = turned[face[(i + 1) % face.length]!]!
      for (let k = 0; k < 3; k++) {
        const [u, v] = [(k + 1) % 3, (k + 2) % 3]
        normal[k] = normal[k]! + (a[u]! - b[u]!) * (a[v]! + b[v]!)
        middle[k] = middle[k]! + a[k]! / face.length
      }
    })
    const outward = dot(normal, middle.map((m, k) => m - centre[k]!)) >= 0 ? 1 : -1
    if (outward * dot(normal, camera) <= 1e-6) continue
    face.forEach((a, i) => {
      const b = face[(i + 1) % face.length]!
      edges.set(a < b ? `${a}-${b}` : `${b}-${a}`, [a, b])
    })
  }

  const neighbours = new Map<number, number[]>()
  for (const [a, b] of edges.values()) {
    neighbours.set(a, [...(neighbours.get(a) ?? []), b])
    neighbours.set(b, [...(neighbours.get(b) ?? []), a])
  }
  const unused = (a: number) => (neighbours.get(a) ?? []).filter((b) => edges.has(a < b ? `${a}-${b}` : `${b}-${a}`))
  const point = (index: number) => project(solid.vertices[index]!, yaw, view, roll).join(" ")

  let d = ""
  while (edges.size > 0) {
    // start at a loose end when there is one, so an open chain is drawn in one stroke
    const ends = [...neighbours.keys()].filter((v) => unused(v).length % 2 === 1)
    const start = ends[0] ?? [...edges.values()][0]![0]
    let at = start
    d += `M${point(start)}`
    for (let next = unused(at)[0]; next !== undefined; next = unused(at)[0]) {
      edges.delete(at < next ? `${at}-${next}` : `${next}-${at}`)
      at = next
      d += at === start ? "Z" : `L${point(at)}`
      if (at === start) break
    }
  }
  return d
}

/** A box `width` × `height` × `depth` centred on the turntable, its base at `bottom`. */
export function cuboid(width: number, height: number, depth: number, bottom = 0, { open = false } = {}): Solid {
  const [w, d] = [width / 2, depth / 2]
  const ring = (y: number): Point3[] => [
    [-w, y, -d],
    [w, y, -d],
    [w, y, d],
    [-w, y, d],
  ]
  return {
    vertices: [...ring(bottom), ...ring(bottom + height)],
    faces: [
      [0, 1, 2, 3],
      ...(open ? [] : [[4, 5, 6, 7]]),
      [0, 1, 5, 4],
      [1, 2, 6, 5],
      [2, 3, 7, 6],
      [3, 0, 4, 7],
    ],
  }
}

/** Yaws `step` degrees apart from `from`, one pose for each of `count` frames. */
export const poses = (from: number, step: number, count: number) =>
  Array.from({ length: count }, (_, i) => from + i * step)

/** Cubic ease in-out, for a turn's yaw over its progress. */
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2)

/**
 * Opacity keyframes that play a turn as a flipbook. `yaws` are the drawn poses, evenly `step` apart, and
 * `yaw(t)` is the turn over its progress. A pose is fully lit while the turn is near it and hands over to
 * the next one in a quick crossfade halfway between, so the moving drawing stays crisp. `period` is the
 * solid's symmetry (90 for a cube): a turn that ends a whole period on lands on the resting pose again.
 */
export function flipbook(
  yaws: readonly number[],
  yaw: (t: number) => number,
  { period = 360, samples = 60 }: { period?: number; samples?: number } = {},
): number[][] {
  const step = Math.abs(yaws[1]! - yaws[0]!)
  const wrap = (d: number) => ((((d + period / 2) % period) + period) % period) - period / 2
  const near = (d: number) => Math.min(1, Math.max(0, (1 - Math.abs(d) / step - 0.3) / 0.4))
  return yaws.map((pose) => Array.from({ length: samples + 1 }, (_, i) => fmt(near(wrap(yaw(i / samples) - pose)))))
}

/**
 * Keyframes for marks fixed on a turning round solid (seams on a can, sprinkles on a ring). Each mark
 * starts at its angle in `angles` (0 faces you), turns `by` degrees with an in-out ease, and is posed at
 * every step by `pose(angle, start)`; a mark the solid hides should get opacity 0 there. The marks come
 * round to each other's places, so on the last frame each one snaps back to its own resting pose, unseen.
 */
export function marks<K extends string>(
  angles: readonly number[],
  by: number,
  pose: (angle: number, start: number) => Record<K, number>,
  samples = 30,
) {
  const steps = Array.from({ length: samples + 1 }, (_, i) => easeInOut(i / samples) * by)
  const keyframes = angles.map((angle) => {
    const frames = [...steps.map((turn) => pose(angle + turn, angle)), pose(angle, angle)]
    const keys = Object.keys(frames[0]!) as K[]
    return Object.fromEntries(keys.map((key) => [key, frames.map((frame) => fmt(frame[key]))])) as Record<K, number[]>
  })
  const times = [...steps.map((_, i) => (0.999 * i) / samples), 1]
  const ease = [...steps.slice(1).map(() => "linear" as const), snap]
  return { keyframes, times, ease }
}
