import { expect, test } from "@playwright/test"
import { PNG } from "pngjs"

// Unit tests can't see this: a variant can run and still not move (motion once dropped scaleX/scaleY on
// SVG silently). Play every icon × variant, screenshot over time, and require each tile to change.
test("every icon variant visibly moves", async ({ page }) => {
  await page.goto("/e2e/variants")
  await page.waitForFunction(() => "__play" in window)
  const tiles = await page.$$eval("[data-tile]", (els) =>
    els.map((el) => {
      const r = el.getBoundingClientRect()
      return { id: (el as HTMLElement).dataset.tile!, x: r.x, y: r.y, w: r.width, h: r.height }
    }),
  )
  expect(tiles.length).toBeGreaterThan(100)

  const shot = async () => PNG.sync.read(await page.screenshot({ fullPage: true }))
  const rest = await shot()
  await page.evaluate(() => (window as unknown as { __play: () => void }).__play())
  const started = Date.now()
  const frames: PNG[] = []
  for (const at of [60, 160, 280, 420, 600, 850, 1300]) {
    await page.waitForTimeout(Math.max(0, at - (Date.now() - started)))
    frames.push(await shot())
  }

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
  const still = tiles.filter((tile) => Math.max(...frames.map((frame) => changed(rest, frame, tile))) < 25).map((t) => t.id)
  expect(still, `variants that don't visibly move: ${still.join(", ")}`).toEqual([])
})
