import { act, fireEvent, render, screen } from "@testing-library/react"
import { createRef } from "react"

import { AnimatedIconsProvider } from "../src/lib/context"
import { createAnimatedIcon } from "../src/lib/create-icon"
import type { AnimatedIconHandle } from "../src/lib/types"

function stubIcon(defaults?: Parameters<typeof createAnimatedIcon>[0]["defaults"]) {
  const ring = vi.fn()
  const shake = vi.fn()
  const Icon = createAnimatedIcon({
    name: "stub",
    category: "status",
    keywords: ["test", "dummy"],
    slots: { primary: "body", accent: "clapper" },
    defaultVariant: "ring",
    defaults,
    variants: { ring: { duration: 600, run: ring }, shake: { duration: 400, run: shake } },
    render: () => <path d="M0 0" />,
  })
  return { Icon, ring, shake }
}

const svg = () => screen.getByTestId("icon")
const flush = () => act(() => Promise.resolve())

describe("createAnimatedIcon", () => {
  it("exposes searchable metadata on the component", () => {
    const { Icon } = stubIcon({ trigger: "auto" })
    expect(Icon.meta).toEqual({
      name: "stub",
      family: "stub",
      category: "status",
      keywords: ["test", "dummy"],
      slots: { primary: "body", accent: "clapper" },
      colors: 2,
      variants: ["ring", "shake"],
      defaultVariant: "ring",
      defaults: { trigger: "auto" },
    })
  })

  it("plays once per hover by default", async () => {
    const { Icon, ring } = stubIcon()
    render(<Icon data-testid="icon" />)
    expect(ring).not.toHaveBeenCalled()
    fireEvent.pointerEnter(svg())
    await flush()
    expect(ring).toHaveBeenCalledTimes(1)
  })

  describe('trigger "none": a static icon', () => {
    it("ignores hover and click", async () => {
      const { Icon, ring } = stubIcon()
      render(<Icon data-testid="icon" trigger="none" />)
      fireEvent.pointerEnter(svg())
      fireEvent.click(svg())
      await flush()
      expect(ring).not.toHaveBeenCalled()
    })

    it("ignores play() through the ref, and the animate prop", async () => {
      const { Icon, ring } = stubIcon()
      const ref = createRef<AnimatedIconHandle>()
      render(<Icon data-testid="icon" trigger="none" animate ref={ref} />)
      await act(() => ref.current!.play())
      ref.current!.start()
      await flush()
      expect(ring).not.toHaveBeenCalled()
    })

    it("overrides an icon's own looping default, and can be set globally", async () => {
      const { Icon, ring } = stubIcon({ trigger: "auto" })
      render(
        <AnimatedIconsProvider icons={{ stub: { trigger: "none" } }}>
          <Icon data-testid="icon" />
        </AnimatedIconsProvider>,
      )
      await flush()
      expect(ring).not.toHaveBeenCalled()
      expect(svg()).toHaveAttribute("data-trigger", "none")
    })
  })

  it("plays the requested variant with the resolved duration in seconds", async () => {
    const { Icon, ring, shake } = stubIcon()
    render(<Icon data-testid="icon" variant="shake" speed={2} />)
    fireEvent.pointerEnter(svg())
    await flush()
    expect(ring).not.toHaveBeenCalled()
    expect(shake).toHaveBeenCalledWith(expect.objectContaining({ seconds: 0.2 }))
    expect(svg()).toHaveAttribute("data-variant", "shake")
  })

  it("plays on click only when trigger is click", async () => {
    const { Icon, ring } = stubIcon()
    render(<Icon data-testid="icon" trigger="click" />)
    fireEvent.pointerEnter(svg())
    await flush()
    expect(ring).not.toHaveBeenCalled()
    fireEvent.click(svg())
    await flush()
    expect(ring).toHaveBeenCalledTimes(1)
  })

  it("starts looping on mount with trigger auto, from the icon's own defaults", async () => {
    const { Icon, ring } = stubIcon({ trigger: "auto" })
    render(<Icon data-testid="icon" />)
    await flush()
    expect(ring).toHaveBeenCalled()
  })

  it("ignores pointer events in controlled mode and follows `animate`", async () => {
    const { Icon, ring } = stubIcon()
    const { rerender } = render(<Icon data-testid="icon" animate={false} />)
    fireEvent.pointerEnter(svg())
    await flush()
    expect(ring).not.toHaveBeenCalled()

    rerender(<Icon data-testid="icon" animate />)
    await flush()
    expect(ring).toHaveBeenCalled()
  })

  it("exposes play() through the ref for manual triggers", async () => {
    const { Icon, ring } = stubIcon()
    const ref = createRef<AnimatedIconHandle>()
    render(<Icon data-testid="icon" trigger="manual" ref={ref} />)
    await act(() => ref.current!.play())
    expect(ring).toHaveBeenCalledTimes(1)
  })

  it("reads the variant and trigger from a provider's per-icon config", async () => {
    const { Icon, shake } = stubIcon()
    render(
      <AnimatedIconsProvider icons={{ stub: { variant: "shake", trigger: "click" } }}>
        <Icon data-testid="icon" />
      </AnimatedIconsProvider>,
    )
    fireEvent.click(svg())
    await flush()
    expect(shake).toHaveBeenCalledTimes(1)
  })

  it("sets color slots as CSS vars, and lets an explicit style win", () => {
    const { Icon } = stubIcon()
    render(<Icon data-testid="icon" colors={{ accent: "destructive", primary: "#000" }} style={{ ["--icon-primary" as string]: "red" }} />)
    expect(svg().style.getPropertyValue("--icon-accent")).toBe("var(--destructive, destructive)")
    expect(svg().style.getPropertyValue("--icon-primary")).toBe("red")
  })

  it("cascades provider colors through a display:contents wrapper", () => {
    const { Icon } = stubIcon()
    const { container } = render(
      <AnimatedIconsProvider colors={{ secondary: "chart-2" }}>
        <Icon data-testid="icon" />
      </AnimatedIconsProvider>,
    )
    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper.style.display).toBe("contents")
    expect(wrapper.style.getPropertyValue("--icon-secondary")).toBe("var(--chart-2, chart-2)")
  })

  it("survives toggling reducedMotion between renders (hook order stays stable)", () => {
    const { Icon } = stubIcon()
    const { rerender } = render(<Icon data-testid="icon" reducedMotion="ignore" />)
    expect(() => rerender(<Icon data-testid="icon" reducedMotion="respect" />)).not.toThrow()
    expect(() => rerender(<Icon data-testid="icon" reducedMotion="ignore" />)).not.toThrow()
  })

  it.each([
    ["sharp", "square", "miter"],
    ["bevel", "square", "bevel"],
    ["round", "round", "round"],
  ] as const)("draws %s corners with %s caps and %s joins", (corners, cap, join) => {
    const { Icon } = stubIcon()
    render(<Icon data-testid="icon" corners={corners} />)
    expect(svg()).toHaveAttribute("stroke-linecap", cap)
    expect(svg()).toHaveAttribute("stroke-linejoin", join)
  })

  describe("corner geometry", () => {
    const Box = createAnimatedIcon({
      name: "box",
      category: "status",
      slots: { primary: "box" },
      defaultVariant: "a",
      variants: { a: { duration: 100, run: () => {} }, b: { duration: 100, run: () => {} } },
      render: () => (
        <g>
          <path data-part="outline" d="M3 3h18v18H3Z" />
          <rect data-part="dot" x="11" y="11" width="2" height="2" />
          <circle cx="12" cy="12" r="4" />
        </g>
      ),
    })

    it("rounds path corners and turns rects into rounded paths, keeping their parts", () => {
      const { container } = render(<Box corners="round" />)
      expect(container.querySelector("[data-part=outline]")?.getAttribute("d")).toContain("Q")
      const dot = container.querySelector("[data-part=dot]")!
      expect(dot.tagName).toBe("path")
      expect(dot.getAttribute("d")).toContain("Q")
      expect(container.querySelector("circle")).toHaveAttribute("r", "4")
    })

    it("leaves the drawing exactly as authored when sharp", () => {
      const { container } = render(<Box corners="sharp" />)
      expect(container.querySelector("[data-part=outline]")).toHaveAttribute("d", "M3 3h18v18H3Z")
      expect(container.querySelector("[data-part=dot]")?.tagName).toBe("rect")
    })

    it("scales the rounding with cornerRadius", () => {
      const { container } = render(<Box corners="round" cornerRadius={4} />)
      expect(container.querySelector("[data-part=outline]")?.getAttribute("d")).toMatch(/^M7 3L17 3Q21 3 21 7/)
    })
  })

  it("takes corners from a provider", () => {
    const { Icon } = stubIcon()
    render(
      <AnimatedIconsProvider corners="round">
        <Icon data-testid="icon" />
      </AnimatedIconsProvider>,
    )
    expect(svg()).toHaveAttribute("stroke-linejoin", "round")
  })

  it("clips to the frame only while a clip variant is active", () => {
    const Icon = createAnimatedIcon({
      name: "stub",
      category: "status",
      slots: { primary: "body" },
      defaultVariant: "stay",
      variants: { stay: { duration: 100, run: () => {} }, leave: { duration: 100, clip: true, run: () => {} } },
      render: () => <path d="M0 0" />,
    })
    const { rerender } = render(<Icon data-testid="icon" />)
    expect(svg()).toHaveAttribute("overflow", "visible")
    rerender(<Icon data-testid="icon" variant="leave" />)
    expect(svg()).toHaveAttribute("overflow", "hidden")
  })

  describe("size", () => {
    it("defaults to 24 and follows the provider, per-icon config, then the prop", () => {
      const { Icon } = stubIcon()
      const { rerender } = render(<Icon data-testid="icon" />)
      expect(svg()).toHaveAttribute("width", "24")
      rerender(
        <AnimatedIconsProvider size={20}>
          <Icon data-testid="icon" />
        </AnimatedIconsProvider>,
      )
      expect(svg()).toHaveAttribute("width", "20")
      expect(svg()).toHaveAttribute("height", "20")
      rerender(
        <AnimatedIconsProvider size={20} icons={{ stub: { size: "1.5em" } }}>
          <Icon data-testid="icon" />
        </AnimatedIconsProvider>,
      )
      expect(svg()).toHaveAttribute("width", "1.5em")
      rerender(
        <AnimatedIconsProvider size={20} icons={{ stub: { size: "1.5em" } }}>
          <Icon data-testid="icon" size={16} />
        </AnimatedIconsProvider>,
      )
      expect(svg()).toHaveAttribute("width", "16")
    })

    it("ignores a blank, negative or non-finite size and falls through to the next level", () => {
      const { Icon } = stubIcon()
      const { rerender } = render(
        <AnimatedIconsProvider size={20}>
          <Icon data-testid="icon" size="" />
        </AnimatedIconsProvider>,
      )
      expect(svg()).toHaveAttribute("width", "20")
      rerender(
        <AnimatedIconsProvider size={Number.NaN}>
          <Icon data-testid="icon" size={-4} />
        </AnimatedIconsProvider>,
      )
      expect(svg()).toHaveAttribute("width", "24")
    })
  })

  describe("strokeWidth", () => {
    it("defaults to 2 and follows the provider, per-icon config, then the prop", () => {
      const { Icon } = stubIcon()
      const { rerender } = render(<Icon data-testid="icon" />)
      expect(svg()).toHaveAttribute("stroke-width", "2")
      rerender(
        <AnimatedIconsProvider strokeWidth={1.5}>
          <Icon data-testid="icon" />
        </AnimatedIconsProvider>,
      )
      expect(svg()).toHaveAttribute("stroke-width", "1.5")
      rerender(
        <AnimatedIconsProvider strokeWidth={1.5} icons={{ stub: { strokeWidth: 2.5 } }}>
          <Icon data-testid="icon" />
        </AnimatedIconsProvider>,
      )
      expect(svg()).toHaveAttribute("stroke-width", "2.5")
      rerender(
        <AnimatedIconsProvider strokeWidth={1.5} icons={{ stub: { strokeWidth: 2.5 } }}>
          <Icon data-testid="icon" strokeWidth={1} />
        </AnimatedIconsProvider>,
      )
      expect(svg()).toHaveAttribute("stroke-width", "1")
    })

    it("ignores an invalid strokeWidth and falls through to the next level", () => {
      const { Icon } = stubIcon()
      render(
        <AnimatedIconsProvider strokeWidth={3}>
          <Icon data-testid="icon" strokeWidth={0} />
        </AnimatedIconsProvider>,
      )
      expect(svg()).toHaveAttribute("stroke-width", "3")
    })

    it("hands the resolved width to the variant", async () => {
      const { Icon, ring } = stubIcon()
      const ref = createRef<AnimatedIconHandle>()
      render(<Icon ref={ref} trigger="manual" strokeWidth={1.25} />)
      act(() => void ref.current!.play())
      await flush()
      expect(ring).toHaveBeenCalledWith(expect.objectContaining({ strokeWidth: 1.25 }))
    })
  })

  it("is decorative unless labelled", () => {
    const { Icon } = stubIcon()
    const { rerender } = render(<Icon data-testid="icon" />)
    expect(svg()).toHaveAttribute("aria-hidden", "true")
    rerender(<Icon data-testid="icon" aria-label="Notifications" />)
    expect(svg()).toHaveAttribute("role", "img")
    expect(svg()).not.toHaveAttribute("aria-hidden")
  })
})
