import { fromCurrent, perSegmentEase, restingPose } from "../src/lib/create-icon"

describe("fromCurrent", () => {
  it("swaps each first keyframe for null, so a restart animates from wherever the part is", () => {
    expect(fromCurrent({ rotate: [0, 30, -26, 0], opacity: [0, 1, 0] })).toEqual({
      rotate: [null, 30, -26, 0],
      opacity: [null, 1, 0],
    })
  })

  it("leaves single values alone", () => {
    expect(fromCurrent({ x: 5, scale: [2] })).toEqual({ x: 5, scale: [2] })
  })
})

describe("restingPose", () => {
  it("takes the last keyframe of every property: where a finished cycle leaves the part", () => {
    expect(restingPose({ rotate: [0, 30, 0], opacity: [0, 1, 0], scale: 1.2 })).toEqual({
      rotate: 0,
      opacity: 0,
      scale: 1.2,
    })
  })
})

describe("perSegmentEase", () => {
  // WAAPI (opacity) applies a single ease to the whole animation, the frame loop (transforms, pathLength)
  // to every segment: per-segment eases keep tracks that share `times` in step
  it("expands a single ease into one per segment", () => {
    expect(perSegmentEase({ opacity: [1, 0, 0, 1] }, { times: [0, 0.3, 0.45, 1], ease: "easeOut" })).toEqual({
      times: [0, 0.3, 0.45, 1],
      ease: ["easeOut", "easeOut", "easeOut"],
    })
  })

  it("treats a cubic-bezier as one ease, and a missing ease as motion's easeInOut", () => {
    expect(perSegmentEase({ x: [0, 7, -7, 0] }, { ease: [0.16, 1, 0.3, 1] })).toEqual({
      ease: [
        [0.16, 1, 0.3, 1],
        [0.16, 1, 0.3, 1],
        [0.16, 1, 0.3, 1],
      ],
    })
    expect(perSegmentEase({ opacity: [1, 0, 1] }, undefined)).toEqual({ ease: ["easeInOut", "easeInOut"] })
  })

  it("leaves per-segment eases, single segments and the caller's options alone", () => {
    const options = { ease: ["easeInOut", "linear"] }
    expect(perSegmentEase({ y: [0, 6, 0] }, options)).toBe(options)
    expect(perSegmentEase({ scale: [1, 1.2] }, { ease: "easeOut" })).toEqual({ ease: "easeOut" })
    const shared = { duration: 1, ease: "easeOut" }
    perSegmentEase({ opacity: [1, 0, 1] }, shared)
    expect(shared).toEqual({ duration: 1, ease: "easeOut" })
  })
})
