// @vitest-environment node
import { readdirSync, readFileSync } from "node:fs"

// The registry is generated (pnpm generate); this keeps it honest about what's in src/icons.
const registry = JSON.parse(readFileSync(new URL("../registry.json", import.meta.url), "utf8")) as {
  items: Array<{ name: string; type: string; registryDependencies?: string[]; files?: unknown[] }>
}
const site = JSON.parse(readFileSync(new URL("../../../apps/web/site.config.json", import.meta.url), "utf8")) as { url: string }
const itemUrl = (name: string) => `${site.url}/r/${name}.json`
const iconNames = readdirSync(new URL("../src/icons", import.meta.url))
  .filter((file) => file.endsWith(".tsx"))
  .map((file) => file.replace(/\.tsx$/, ""))
  .sort()

describe("registry.json", () => {
  it("ships every file in src/lib with the core, plus config.ts (a missing one breaks every install)", () => {
    const core = registry.items.find((item) => item.name === "animated-icons") as { files: Array<{ path: string }> }
    const shipped = core.files.map((file) => file.path).sort()
    const lib = readdirSync(new URL("../src/lib", import.meta.url))
      .filter((file) => /\.tsx?$/.test(file))
      .map((file) => `src/lib/${file}`)
    expect(shipped).toEqual([...lib, "src/config.ts"].sort())
  })

  it("has one item per icon file (run `pnpm generate` after adding an icon)", () => {
    const items = registry.items.map((item) => item.name)
    for (const name of iconNames) expect(items, name).toContain(name)
  })

  it("links every icon to the core by full URL, so installs work without a namespace", () => {
    for (const item of registry.items.filter((item) => iconNames.includes(item.name))) {
      expect(item.registryDependencies, item.name).toEqual([itemUrl("animated-icons")])
    }
  })

  it("has an `all` bundle that installs every icon, and nothing else", () => {
    const all = registry.items.find((item) => item.name === "all")
    expect(all?.type).toBe("registry:item")
    expect(all?.files ?? []).toEqual([])
    expect([...(all?.registryDependencies ?? [])].sort()).toEqual(iconNames.map(itemUrl).sort())
  })
})
