import { act, fireEvent, render, screen } from "@testing-library/react"
import { StrictMode } from "react"

import { createAnimatedIcon } from "../src/lib/create-icon"

// motion leaves a stopped animation's promise pending forever: model exactly that.
const { animateSpy, stopSpy } = vi.hoisted(() => {
  const stopSpy = vi.fn()
  const animateSpy = vi.fn(() => Object.assign(new Promise(() => {}), { stop: stopSpy }))
  return { animateSpy, stopSpy }
})

vi.mock("motion/react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("motion/react")>()),
  useAnimate: () => [{ current: null }, animateSpy],
}))

function stubIcon(defaults?: { trigger: "auto" }) {
  return createAnimatedIcon({
    name: "stub",
    category: "status",
    slots: { primary: "body" },
    defaultVariant: "wave",
    defaults,
    variants: {
      wave: { duration: 600, run: ({ animate }) => animate("[data-part=a]", { rotate: [0, 30, 0] }) },
      nod: { duration: 600, run: ({ animate }) => animate("[data-part=b]", { y: [0, 4, 0] }) },
    },
    render: () => <path d="M0 0" />,
  })
}

const flush = () => act(() => Promise.resolve())

beforeEach(() => {
  animateSpy.mockClear()
  stopSpy.mockClear()
})

describe("drawing strokes on", () => {
  it("pads pathLength with pathSpacing 1, so no stray dash paints a dot at the path's end", async () => {
    const Icon = createAnimatedIcon({
      name: "stub",
      category: "status",
      slots: { primary: "body" },
      defaultVariant: "draw",
      variants: {
        draw: { duration: 600, run: ({ animate }) => animate("[data-part=a]", { pathLength: [0, 1] }) },
        other: { duration: 600, run: () => {} },
      },
      render: () => <path d="M0 0" />,
    })
    render(<Icon data-testid="icon" />)
    fireEvent.pointerEnter(screen.getByTestId("icon"))
    await flush()
    expect(animateSpy).toHaveBeenCalledWith("[data-part=a]", { pathLength: [0, 1], pathSpacing: [1, 1] }, undefined)
  })
})

describe("re-triggering mid-animation", () => {
  it("restarts from the current pose instead of ignoring the hover", async () => {
    const Icon = stubIcon()
    render(<Icon data-testid="icon" />)

    fireEvent.pointerEnter(screen.getByTestId("icon"))
    await flush()
    fireEvent.pointerEnter(screen.getByTestId("icon"))
    await flush()

    expect(stopSpy).toHaveBeenCalledTimes(1)
    expect(animateSpy).toHaveBeenNthCalledWith(1, "[data-part=a]", { rotate: [0, 30, 0] }, undefined)
    expect(animateSpy).toHaveBeenNthCalledWith(2, "[data-part=a]", { rotate: [null, 30, 0] }, undefined)
  })

  it("settles the old variant's parts at rest when a restart switches variant", async () => {
    const Icon = stubIcon()
    const { rerender } = render(<Icon data-testid="icon" />)
    fireEvent.pointerEnter(screen.getByTestId("icon"))
    await flush()

    rerender(<Icon data-testid="icon" variant="nod" />)
    await flush()
    fireEvent.pointerEnter(screen.getByTestId("icon"))
    await flush()

    expect(animateSpy).toHaveBeenCalledWith("[data-part=a]", { rotate: 0 }, { duration: 0 })
    expect(animateSpy).toHaveBeenLastCalledWith("[data-part=b]", { y: [null, 4, 0] }, undefined)
  })

  it("keeps an auto icon alive through StrictMode's simulated unmount", async () => {
    const Icon = stubIcon({ trigger: "auto" })
    render(
      <StrictMode>
        <Icon />
      </StrictMode>,
    )
    await flush()
    // mount → run, simulated unmount interrupts it, remount → runs again (before: hung forever)
    expect(animateSpy.mock.calls.length).toBeGreaterThanOrEqual(2)
  })
})
