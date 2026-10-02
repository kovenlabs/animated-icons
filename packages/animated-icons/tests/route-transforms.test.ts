import { routeTransforms } from "../src/lib/create-icon"

describe("routeTransforms (works around motion 13 routing scaleX/scaleY/skew on SVG to attributes)", () => {
  function scene() {
    const root = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    root.innerHTML = `<path data-part="door" d="M0 0"/><path data-part="door" d="M1 1"/><path data-part="other" d="M2 2"/>`
    return root
  }

  it("makes transform-only keys visible on each target's style, so motion animates them as transforms", () => {
    const root = scene()
    routeTransforms(root, "[data-part=door]", { scaleX: [1, 0.3, 1], skewX: [0, 8, 0], opacity: [1, 0, 1] })
    for (const door of root.querySelectorAll("[data-part=door]")) {
      const style = (door as SVGElement).style
      expect("scaleX" in style).toBe(true)
      expect("skewX" in style).toBe(true)
    }
    expect("scaleX" in (root.querySelector("[data-part=other]") as SVGElement).style).toBe(false)
  })

  it("leaves keys that are already real CSS properties alone", () => {
    const root = scene()
    const door = root.querySelector("[data-part=door]") as SVGElement
    const descriptor = Object.getOwnPropertyDescriptor(door.style, "opacity")
    routeTransforms(root, "[data-part=door]", { opacity: [1, 0] })
    expect(Object.getOwnPropertyDescriptor(door.style, "opacity")).toEqual(descriptor)
  })

  it("ignores non-selector targets", () => {
    expect(() => routeTransforms(scene(), { not: "a selector" }, { scaleX: [1, 0] })).not.toThrow()
  })
})
