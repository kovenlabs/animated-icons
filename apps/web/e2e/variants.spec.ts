import { expect, test } from "@playwright/test"
import { PNG } from "pngjs"

// Unit tests can't see this: a variant can run and still not move (motion once dropped scaleX/scaleY on
// SVG silently). Play every icon × variant, screenshot over time, and require each tile to change.
//
// The harness plays at quarter speed and is split into chunks of 72 tiles. Each chunk is played and
// screenshotted on its own: a small shot is fast even on a slow CI runner, so samples stay close together
// and a short variant (a 500ms pop) can't fall between two of them, however many icons the set grows to.
test("every icon variant visibly moves", async ({ page }) => {
  test.setTimeout(180_000)
  await page.goto("/e2e/variants")
  await page.waitForFunction(() => "__play" in window)
  const chunks = await page.locator("[data-chunk]").count()
  expect(chunks).toBeGreaterThan(0)

  const still: string[] = []
  let total = 0
  for (let chunk = 0; chunk < chunks; chunk++) {
    const area = page.locator(`[data-chunk="${chunk}"]`)
    await area.scrollIntoViewIfNeeded()
    const tiles = await area.evaluate((el) => {
      const box = el.getBoundingClientRect()
      return [...el.querySelectorAll<HTMLElement>("[data-tile]")].map((tile) => {
        const r = tile.getBoundingClientRect()
        return { id: tile.dataset.tile!, x: r.x - box.x, y: r.y - box.y, w: r.width, h: r.height }
      })
    })
    total += tiles.length

    const shot = async () => PNG.sync.read(await area.screenshot())
    const rest = await shot()
    await page.evaluate((i) => (window as unknown as { __play: (chunk: number) => void }).__play(i), chunk)
    const started = Date.now()
    const frames: PNG[] = []
    while (Date.now() - started < 3000 || frames.length < 10) frames.push(await shot())

    const changed = (a: PNG, b: PNG, { x, y, w, h }: (typeof tiles)[number]) => {
      let n = 0
      for (let j = Math.floor(y); j < y + h; j++)
        for (let i = Math.floor(x); i < x + w; i++) {
          const k = (j * a.width + i) * 4
          const d = Math.abs(a.data[k]! - b.data[k]!) + Math.abs(a.data[k + 1]! - b.data[k + 1]!) + Math.abs(a.data[k + 2]! - b.data[k + 2]!)
          if (d > 30) n++
        }
      return n
    }
    still.push(...tiles.filter((tile) => Math.max(...frames.map((frame) => changed(rest, frame, tile))) < 25).map((t) => t.id))
  }
  expect(total).toBeGreaterThan(100)
  expect(still, `variants that don't visibly move: ${still.join(", ")}`).toEqual([])
})
