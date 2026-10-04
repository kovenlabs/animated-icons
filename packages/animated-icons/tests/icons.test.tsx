import { act, render } from "@testing-library/react"
import { createRef, type ComponentType } from "react"

import type { AnimatedIconHandle, AnimatedIconProps, IconMeta } from "../src/lib/types"

// Every icon file is discovered here: a new icon is covered without touching this test.
const modules = import.meta.glob<Record<string, unknown>>("../src/icons/*.tsx", { eager: true })

// Record every animate() call instead of running motion.
const { calls } = vi.hoisted(() => ({ calls: [] as Array<[target: unknown, keyframes: Record<string, unknown>]> }))
vi.mock("motion/react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("motion/react")>()),
  useAnimate: () => [
    { current: null },
    (target: unknown, keyframes: Record<string, unknown>) => {
      calls.push([target, keyframes])
      return Object.assign(new Promise(() => {}), { stop: () => {} })
    },
  ],
}))

type Icon = ComponentType<AnimatedIconProps> & { meta: IconMeta }

const toPascal = (name: string) => name.replace(/(^|-)(\w)/g, (_, __, c: string) => c.toUpperCase())

const icons = Object.entries(modules).map(([path, exports]) => {
  const file = path.split("/").pop()!.replace(/\.tsx$/, "")
  const components = Object.entries(exports).filter(([, value]) => typeof value === "function" && "meta" in value)
  return { file, components: components as Array<[string, Icon]> }
})

const REST: Record<string, number> = { x: 0, y: 0, rotate: 0, scale: 1, scaleX: 1, scaleY: 1, pathLength: 1 }

/** The value a part sits at when nothing is playing (undefined: anything goes). */
function restValue(element: Element, key: string) {
  const style = (element as SVGElement).style
  const hiddenAtRest = style.opacity === "0"
  if (key === "opacity") return hiddenAtRest ? 0 : 1
  if (hiddenAtRest) return undefined // an accent that ends invisible may end anywhere
  if (style.transform && key.startsWith("scale")) return undefined // posed at rest, e.g. scale(0.55)
  return REST[key]
}

/** rotate 360 is the same pose as rotate 0. */
const normalize = (key: string, value: number) => (key === "rotate" ? ((value % 360) + 360) % 360 : value)

it("finds icons", () => {
  expect(icons.length).toBeGreaterThan(0)
})

// Shape siblings are linked so the catalog can show them together: an icon whose name extends another
// icon's name (bell-off → bell) or shares its first segment with another icon (git-branch, git-merge)
// belongs to that segment's family.
it("links related shapes into a family", () => {
  const names = icons.map(({ file }) => file)
  const unlinked = icons.flatMap(({ file, components }) => {
    const segment = file.split("-")[0]!
    if (segment === file) return []
    const related = names.some((other) => other !== file && (other === segment || other.startsWith(`${segment}-`)))
    const family = components[0]?.[1].meta.family
    return related && family !== segment ? [`${file} (family "${family}", expected "${segment}")`] : []
  })
  expect(unlinked, `unlinked siblings: ${unlinked.join(", ")}`).toEqual([])
})

describe.each(icons)("$file", ({ file, components }) => {
  it("exports exactly one icon, named after its file", () => {
    expect(components).toHaveLength(1)
    const [exportName, Icon] = components[0]!
    expect(Icon.meta.name).toBe(file)
    expect(exportName).toBe(`${toPascal(file)}Icon`)
  })

  const [, Icon] = components[0] ?? []
  if (!Icon) return
  const { meta } = Icon

  it("has complete metadata", () => {
    expect(meta.colors).toBeGreaterThanOrEqual(1)
    expect(meta.colors).toBeLessThanOrEqual(3)
    expect(meta.slots.primary).toBeTruthy()
    if (meta.colors === 2) expect(meta.slots.accent).toBeTruthy()
    expect(meta.variants.length).toBeGreaterThanOrEqual(2)
    expect(meta.variants).toContain(meta.defaultVariant)
    expect(meta.keywords.length).toBeGreaterThanOrEqual(3)
    // a family is named by its base icon: messages / message-text belong to message
    expect(meta.name.startsWith(meta.family), `family "${meta.family}"`).toBe(true)
  })

  it("is drawn in the sharp house style", () => {
    // the authored drawing: corner rounding happens at render, on top of it
    const { container } = render(<Icon corners="sharp" />)
    const svg = container.querySelector("svg")!
    for (const element of svg.querySelectorAll("*")) {
      // caps and joins come from the root only, so the `corners` option reaches every part
      expect(element.getAttribute("stroke-linecap"), `${element.tagName} sets its own linecap`).toBeNull()
      expect(element.getAttribute("stroke-linejoin"), `${element.tagName} sets its own linejoin`).toBeNull()
      if (element.tagName === "rect") {
        expect(Number(element.getAttribute("rx") ?? 0), "rounded rect").toBe(0)
        expect(Number(element.getAttribute("ry") ?? 0), "rounded rect").toBe(0)
      }
    }
  })

  it.each(["sharp", "bevel", "round"] as const)("renders with %s corners", (corners) => {
    const { container } = render(<Icon corners={corners} />)
    expect(container.querySelector("svg")).toHaveAttribute("data-corners", corners)
    for (const path of container.querySelectorAll("path")) expect(path.getAttribute("d")).not.toMatch(/NaN|undefined/)
  })

  describe.each(meta.variants)("variant %s", (variant) => {
    it("animates only parts that exist, and every track ends at rest", async () => {
      calls.length = 0
      const ref = createRef<AnimatedIconHandle>()
      const { container } = render(<Icon ref={ref} variant={variant} trigger="manual" />)
      act(() => void ref.current!.play())
      await act(() => Promise.resolve())

      expect(calls.length).toBeGreaterThan(0)

      // a part that travels 5px+ leaves the frame: the variant must clip to the 24px box
      const travels = calls.some(([target, keyframes]) => {
        const hidden = (container.querySelector(target as string) as SVGElement | null)?.style.opacity === "0"
        return !hidden && ["x", "y"].some((key) => (keyframes[key] as number[] | undefined)?.some((v) => Math.abs(v) >= 5))
      })
      // ...or say explicitly that it stays inside (`clip: false`)
      if (travels) expect(container.querySelector("svg")?.getAttribute("data-clip"), "travels 5px+: declare clip").not.toBeNull()

      for (const [target, keyframes] of calls) {
        expect(typeof target, "animate targets are [data-part] selectors").toBe("string")
        const elements = container.querySelectorAll(target as string)
        expect(elements.length, `${String(target)} matches nothing`).toBeGreaterThan(0)

        for (const [key, value] of Object.entries(keyframes)) {
          if (!Array.isArray(value)) continue
          for (const element of elements) {
            const rest = restValue(element, key)
            if (rest === undefined) continue
            expect(normalize(key, value.at(-1)), `${String(target)} ${key} must end at rest`).toBeCloseTo(rest, 5)
          }
        }
      }
    })
  })
})
