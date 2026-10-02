import type { Corners } from "./types"

/**
 * Geometry rounding. Icons are drawn sharp, out of straight segments; at render time every corner
 * between two straight segments is replaced by a curve (`round`) or a straight cut (`bevel`).
 * Subpaths that contain curves (arcs, béziers) are left exactly as drawn.
 */

type Point = [number, number]

interface Subpath {
  points: Point[]
  closed: boolean
  /** The subpath's original text, kept when it contains curves. */
  raw?: string
}

const COMMAND = /([MmLlHhVvZzAaCcQqSsTt])([^MmLlHhVvZzAaCcQqSsTt]*)/g
const CURVES = /[AaCcQqSsTt]/

const numbers = (text: string) => (text.match(/-?(?:\d+\.?\d*|\.\d+)(?:e-?\d+)?/gi) ?? []).map(Number)

function parse(d: string): Subpath[] {
  const subpaths: Subpath[] = []
  let current: Subpath | null = null
  let rawStart = 0
  let pen: Point = [0, 0]
  let start: Point = [0, 0]

  for (const match of d.matchAll(COMMAND)) {
    const [whole, command, args] = match as unknown as [string, string, string]
    const relative = command === command.toLowerCase()
    const values = numbers(args)

    if (command === "M" || command === "m") {
      if (current) subpaths.push(current)
      rawStart = match.index!
      for (let i = 0; i + 1 < values.length; i += 2) {
        const point: Point = relative ? [pen[0] + values[i]!, pen[1] + values[i + 1]!] : [values[i]!, values[i + 1]!]
        if (i === 0) {
          current = { points: [point], closed: false }
          start = point
        } else current!.points.push(point) // extra pairs after M are implicit linetos
        pen = point
      }
      continue
    }
    if (!current) continue

    if (CURVES.test(command)) {
      // keep this subpath verbatim: find where it ends
      const rest = d.slice(match.index! + whole.length)
      const next = rest.search(/[Mm]/)
      current.raw = d.slice(rawStart, next === -1 ? undefined : match.index! + whole.length + next)
      continue
    }

    switch (command) {
      case "L":
      case "l":
        for (let i = 0; i + 1 < values.length; i += 2) {
          pen = relative ? [pen[0] + values[i]!, pen[1] + values[i + 1]!] : [values[i]!, values[i + 1]!]
          current.points.push(pen)
        }
        break
      case "H":
      case "h":
        for (const value of values) {
          pen = [relative ? pen[0] + value : value, pen[1]]
          current.points.push(pen)
        }
        break
      case "V":
      case "v":
        for (const value of values) {
          pen = [pen[0], relative ? pen[1] + value : value]
          current.points.push(pen)
        }
        break
      case "Z":
      case "z":
        current.closed = true
        pen = start
        break
    }
  }
  if (current) subpaths.push(current)
  return subpaths
}

const fmt = (n: number) => String(Math.round(n * 1000) / 1000)
const pt = ([x, y]: Point) => `${fmt(x)} ${fmt(y)}`
const same = (a: Point, b: Point) => Math.abs(a[0] - b[0]) < 1e-9 && Math.abs(a[1] - b[1]) < 1e-9

/** Drop repeated points and points in the middle of a straight run. */
function simplify(points: Point[], closed: boolean) {
  const unique = points.filter((p, i) => i === 0 || !same(p, points[i - 1]!))
  if (closed && unique.length > 1 && same(unique[0]!, unique.at(-1)!)) unique.pop()
  return unique.filter((p, i) => {
    if (!closed && (i === 0 || i === unique.length - 1)) return true
    const a = unique[(i - 1 + unique.length) % unique.length]!
    const b = unique[(i + 1) % unique.length]!
    const cross = (p[0] - a[0]) * (b[1] - p[1]) - (p[1] - a[1]) * (b[0] - p[0])
    const dot = (p[0] - a[0]) * (b[0] - p[0]) + (p[1] - a[1]) * (b[1] - p[1])
    return Math.abs(cross) > 1e-9 || dot < 0
  })
}

/**
 * How far along each side a corner reaches. Round may take half a side (a small square becomes a
 * circle); bevel only a third, so a small square becomes an octagon rather than a diamond.
 */
const REACH = { round: 1 / 2, bevel: 1 / 3 }

function corner(a: Point, p: Point, b: Point, radius: number, mode: "round" | "bevel") {
  const l1 = Math.hypot(a[0] - p[0], a[1] - p[1])
  const l2 = Math.hypot(b[0] - p[0], b[1] - p[1])
  const t = Math.min(radius, l1 * REACH[mode], l2 * REACH[mode])
  const into: Point = [p[0] + ((a[0] - p[0]) / l1) * t, p[1] + ((a[1] - p[1]) / l1) * t]
  const out: Point = [p[0] + ((b[0] - p[0]) / l2) * t, p[1] + ((b[1] - p[1]) / l2) * t]
  return { into, out }
}

function shapeSubpath({ points: raw, closed }: Subpath, radius: number, mode: "round" | "bevel") {
  const points = simplify(raw, closed)
  const turn = (p: Point, out: Point) => (mode === "round" ? `Q${pt(p)} ${pt(out)}` : `L${pt(out)}`)

  if (!closed || points.length < 3) {
    if (points.length < 3) return `M${points.map(pt).join("L")}${closed ? "Z" : ""}`
    let d = `M${pt(points[0]!)}`
    for (let i = 1; i < points.length - 1; i++) {
      const { into, out } = corner(points[i - 1]!, points[i]!, points[i + 1]!, radius, mode)
      d += `L${pt(into)}${turn(points[i]!, out)}`
    }
    return `${d}L${pt(points.at(-1)!)}`
  }

  const n = points.length
  const corners = points.map((p, i) => corner(points[(i - 1 + n) % n]!, p, points[(i + 1) % n]!, radius, mode))
  let d = `M${pt(corners[0]!.out)}`
  for (let i = 1; i <= n; i++) {
    const k = i % n
    d += `L${pt(corners[k]!.into)}${turn(points[k]!, corners[k]!.out)}`
  }
  return `${d}Z`
}

export function roundPath(d: string, radius: number, corners: Corners) {
  if (corners === "sharp" || radius <= 0) return d
  return parse(d)
    .map((subpath) => subpath.raw ?? shapeSubpath(subpath, radius, corners))
    .join("")
}

export function rectPath(x: number, y: number, width: number, height: number) {
  return `M${fmt(x)} ${fmt(y)}h${fmt(width)}v${fmt(height)}h${fmt(-width)}Z`
}
