import { fromCurrent, restingPose } from "../src/lib/create-icon"

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
