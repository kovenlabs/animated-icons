import { badgeGlyph, bubble, dots } from "../src/lib/parts"

describe("parts", () => {
  it("bubble(3, 4, 18, 12) is exactly the message icon's bubble", () => {
    expect(bubble(3, 4, 18, 12)).toBe("M3 4h18v12H12l-6 4v-4H3Z")
  })

  it("mirrors the tail to the right", () => {
    expect(bubble(3, 4, 18, 12, "right")).toBe("M21 4H3v12H12l6 4v-4H21Z")
  })

  it("centres badge glyphs anywhere, not only in the badge zone", () => {
    expect(badgeGlyph.plus(12, 13)).toBe("M12 10v6M9 13h6")
    expect(badgeGlyph.plus()).toBe("M18 3v6M15 6h6")
  })

  it("lays out three dots, centred", () => {
    expect(dots(12, 10)).toEqual([
      { x: 7, y: 9 },
      { x: 11, y: 9 },
      { x: 15, y: 9 },
    ])
  })
})
