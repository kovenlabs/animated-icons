// @vitest-environment node
import { readFileSync } from "node:fs"

import * as library from "../src/index"
import type { IconMeta } from "../src/lib/types"
import packageJson from "../package.json"

// catalog.json is generated (pnpm generate) from each icon's real `meta`: it's what agents search to pick an
// icon, a variant and a trigger (skills/find-animated-icon). This keeps it honest about what ships.
const catalog = JSON.parse(readFileSync(new URL("../catalog.json", import.meta.url), "utf8")) as {
  version: string
  icons: Array<IconMeta & { component: string; description?: string }>
}

const icons = [...new Set(Object.values(library).filter((value) => typeof value === "function" && "meta" in value))] as Array<
  { displayName: string; meta: IconMeta }
>

describe("catalog.json", () => {
  it("is stamped with the package version, so a stale copy is easy to spot", () => {
    expect(catalog.version).toBe(packageJson.version)
  })

  it("has one entry per exported icon, sorted by name", () => {
    const names = icons.map((icon) => icon.meta.name).sort()
    expect(catalog.icons.map((icon) => icon.name)).toEqual(names)
  })

  it("matches each icon's meta exactly (run `pnpm generate` after changing an icon)", () => {
    const byName = new Map(catalog.icons.map((entry) => [entry.name, entry]))
    for (const icon of icons) {
      const { component, description: _description, ...meta } = byName.get(icon.meta.name)!
      expect(meta, icon.meta.name).toEqual(JSON.parse(JSON.stringify(icon.meta)))
      expect(component, icon.meta.name).toBe(icon.displayName)
    }
  })

  it("carries each icon's doc comment as its description", () => {
    const bell = catalog.icons.find((entry) => entry.name === "bell")
    expect(bell?.description).toBe("2 colors: body (primary), clapper and sound waves (accent).")
  })

  it("takes only the comment right above the export, never code or an earlier comment", () => {
    const activity = catalog.icons.find((entry) => entry.name === "activity")
    expect(activity?.description).toMatch(/^1 color\b/)
    for (const entry of catalog.icons) expect(entry.description ?? "", entry.name).not.toMatch(/\*\/|\/\*\*|const /)
  })
})
