import { rectPath, roundPath } from "../src/lib/round"

describe("roundPath", () => {
  it("rounds every corner of a closed square with quadratic curves", () => {
    expect(roundPath("M3 3h10v10H3Z", 2, "round")).toBe(
      "M5 3L11 3Q13 3 13 5L13 11Q13 13 11 13L5 13Q3 13 3 11L3 5Q3 3 5 3Z",
    )
  })

  it("chamfers instead of curving in bevel mode", () => {
    expect(roundPath("M3 3h10v10H3Z", 2, "bevel")).toBe("M5 3L11 3L13 5L13 11L11 13L5 13L3 11L3 5L5 3Z")
  })

  it("bevels a small square into an octagon, never a diamond (cuts reach at most a third of a side)", () => {
    expect(roundPath("M0 0h3v3H0Z", 2, "bevel")).toBe("M1 0L2 0L3 1L3 2L2 3L1 3L0 2L0 1L1 0Z")
  })

  it("rounds only the inner vertices of an open path, and keeps its endpoints", () => {
    // a tick: implicit lineto after M
    expect(roundPath("M3 12 9 18 20 6", 2, "round")).toBe("M3 12L7.586 16.586Q9 18 10.351 16.526L20 6")
  })

  it("never lets a corner eat more than half of a segment", () => {
    // 2px segments: the radius is clamped to 1
    expect(roundPath("M0 0h2v2", 5, "round")).toBe("M0 0L1 0Q2 0 2 1L2 2")
  })

  it("reads relative commands", () => {
    expect(roundPath("m3 3 10 0 0 10", 2, "round")).toBe(roundPath("M3 3L13 3L13 13", 2, "round"))
  })

  it("rounds each subpath on its own", () => {
    expect(roundPath("M0 0h4v4M10 0h4v4", 1, "round")).toBe("M0 0L3 0Q4 0 4 1L4 4M10 0L13 0Q14 0 14 1L14 4")
  })

  it("leaves straight runs and curves alone", () => {
    expect(roundPath("M0 0h4h4", 2, "round")).toBe("M0 0L8 0")
    expect(roundPath("M7 10a3 3 0 0 1 3-3", 2, "round")).toBe("M7 10a3 3 0 0 1 3-3")
  })

  it("is a no-op for sharp corners or a zero radius", () => {
    expect(roundPath("M3 3h10v10H3Z", 2, "sharp")).toBe("M3 3h10v10H3Z")
    expect(roundPath("M3 3h10v10H3Z", 0, "round")).toBe("M3 3h10v10H3Z")
  })
})

describe("rectPath", () => {
  it("turns a rect into a closed path", () => {
    expect(rectPath(17, 2, 5, 5)).toBe("M17 2h5v5h-5Z")
  })
})
