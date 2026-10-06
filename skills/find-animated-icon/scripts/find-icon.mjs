#!/usr/bin/env node
// Search the @kovenlabs/animated-icons catalog: which icon, which variant, what it paints.
// Zero dependencies, Node 18+. Run with --help.
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join, resolve } from "node:path"

const SITE = "https://animated-icons-nu.vercel.app"
const PACKAGE = "@kovenlabs/animated-icons"
const RAW = "https://raw.githubusercontent.com/kovenlabs/animated-icons/main/packages/animated-icons/src/icons"
const CACHE = join(tmpdir(), "kovenlabs-animated-icons-catalog.json")
const DAY = 24 * 60 * 60 * 1000

const HELP = `Find the right animated icon, variant and trigger.

  find-icon.mjs <words...>       rank icons for a use case ("unread notifications", "copy to clipboard")
  find-icon.mjs --show <name>    one icon in full: variants, colors, siblings, install, JSX
  find-icon.mjs --source <name>  the icon's file: read what each variant actually does
  find-icon.mjs --list           every icon on one line (name, category, keywords) to scan by meaning

  --category <c>   only this category (--list prints the categories)
  --colors <n>     only icons with n color slots (1, 2 or 3)
  --limit <n>      results to print (default 8)
  --json           machine-readable output
  --catalog <p>    a catalog.json path or URL (default: the project's installed package, else the site)
`

const args = process.argv.slice(2)
const flags = {}
const words = []
for (let i = 0; i < args.length; i++) {
  const arg = args[i]
  if (["--help", "-h", "--list", "--json"].includes(arg)) flags[arg.replace(/^-+/, "")] = true
  else if (arg.startsWith("--")) flags[arg.slice(2)] = args[++i]
  else words.push(arg)
}

if (flags.help || flags.h || (!flags.list && !flags.show && !flags.source && words.length === 0)) {
  console.log(HELP)
  process.exit(0)
}

/** Walk up from the working directory, so it works from any folder of the project. */
function findUp(relative) {
  for (let dir = process.cwd(); ; dir = dirname(dir)) {
    const candidate = join(dir, relative)
    if (existsSync(candidate)) return candidate
    if (dirname(dir) === dir) return null
  }
}

async function loadCatalog() {
  if (flags.catalog) {
    if (/^https?:/.test(flags.catalog)) return { catalog: await fetchJson(flags.catalog), from: flags.catalog }
    return { catalog: JSON.parse(readFileSync(resolve(flags.catalog), "utf8")), from: flags.catalog }
  }
  // the installed package's own catalog matches the version the project actually has
  const installed = findUp(`node_modules/${PACKAGE}/catalog.json`)
  if (installed) return { catalog: JSON.parse(readFileSync(installed, "utf8")), from: installed }
  try {
    const cached = JSON.parse(readFileSync(CACHE, "utf8"))
    if (Date.now() - cached.fetchedAt < DAY) return { catalog: cached.catalog, from: `${SITE}/icons.json (cached)` }
  } catch {}
  const catalog = await fetchJson(`${SITE}/icons.json`)
  try {
    writeFileSync(CACHE, JSON.stringify({ fetchedAt: Date.now(), catalog }))
  } catch {}
  return { catalog, from: `${SITE}/icons.json` }
}

async function fetchJson(url) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`)
  return response.json()
}

// ---------- search ----------

const STOP = new Set(
  "a an the for to of and or with in on at by as from into my our your their this that these when while is are be it its icon icons animated animation show shows showing something thing"
    .split(" "),
)

/** Crude stemming, so "notifications" meets "notification" and "uploading" meets "upload". */
const stem = (word) => {
  const singular = word.length > 3 ? word.replace(/(?<![su])s$/, "") : word
  return singular.length > 5 ? singular.replace(/(ing|ed)$/, "") : singular
}
const tokens = (text) =>
  String(text)
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)

/** How strongly one query term matches one icon: its name beats its keywords beats everything else. */
function termWeight(icon, term) {
  const name = tokens(icon.name).map(stem)
  const keywords = icon.keywords.flatMap(tokens).map(stem)
  const variants = icon.variants.flatMap(tokens).map(stem)
  const loose = [...Object.values(icon.slots), icon.description ?? ""].flatMap(tokens).map(stem)
  const partial = (list) => term.length >= 4 && list.some((word) => word.length >= 4 && (word.includes(term) || term.includes(word)))
  return Math.max(
    name.includes(term) ? 10 : partial(name) ? 5 : 0,
    keywords.includes(term) ? 6 : partial(keywords) ? 3 : 0,
    stem(icon.category) === term ? 3 : 0,
    variants.includes(term) ? 3 : 0,
    loose.includes(term) ? 1 : 0,
  )
}

function search(icons, query) {
  const terms = [...new Set(tokens(query).filter((word) => !STOP.has(word)).map(stem))]
  const phrase = tokens(query).join("-")
  const weights = icons.map((icon) => terms.map((term) => termWeight(icon, term)))
  // a term few icons answer ("favorite") says more about the intent than one many answer ("add")
  const rarity = terms.map((_, t) => {
    const answering = weights.filter((row) => row[t] > 0).length
    return answering ? 1 + Math.log(icons.length / answering) : 0
  })
  return icons
    .map((icon, i) => {
      const matched = weights[i].filter((weight) => weight > 0).length
      const total = weights[i].reduce((sum, weight, t) => sum + weight * rarity[t], 0)
      // an icon that answers every word of the query beats one that answers one word loudly
      return { icon, score: Math.round(total + matched * 4 + (icon.name === phrase ? 30 : 0)) }
    })
    .filter((hit) => hit.score > 4)
    .sort((a, b) => b.score - a.score || a.icon.name.localeCompare(b.icon.name))
}

// ---------- output ----------

const siblingsOf = (icons, icon) => icons.filter((other) => other.family === icon.family && other !== icon).map((other) => other.name)

function summary(icons, icon) {
  const lines = [
    `${icon.name}  <${icon.component} />  · ${icon.category} · ${icon.colors} color${icon.colors > 1 ? "s" : ""}`,
    `  variants: ${icon.variants.map((v) => (v === icon.defaultVariant ? `${v} (default)` : v)).join(", ")}`,
    `  slots:    ${Object.entries(icon.slots).map(([slot, part]) => `${slot} = ${part}`).join(" · ")}`,
    `  keywords: ${icon.keywords.join(", ")}`,
  ]
  if (icon.defaults) lines.push(`  defaults: ${Object.entries(icon.defaults).map(([key, value]) => `${key} ${value}`).join(", ")} (its own, beaten by config and props)`)
  const siblings = siblingsOf(icons, icon)
  if (siblings.length) lines.push(`  family:   ${siblings.join(", ")}`)
  return lines.join("\n")
}

function detail(icons, icon, site) {
  const variant = icon.defaultVariant
  return [
    summary(icons, icon),
    icon.description ? `  about:    ${icon.description}` : null,
    "",
    "  install (match how the project already uses the library):",
    `    package: import { ${icon.component} } from "${PACKAGE}"`,
    `    shadcn:  npx shadcn add @kovenlabs/${icon.name}     (or ${site}/r/${icon.name}.json without the namespace)`,
    "",
    "  jsx:",
    `    <${icon.component} />    plays "${variant}" ${icon.defaults?.trigger && icon.defaults.trigger !== "hover" ? `with its own trigger, ${icon.defaults.trigger}` : "on hover"}`,
    ...icon.variants
      .filter((v) => v !== variant)
      .map((v) => `    <${icon.component} variant="${v}" />`),
    "",
    `  what each variant does: find-icon.mjs --source ${icon.name}`,
    `  watch them play: ${site}/icons (search "${icon.name}")`,
  ]
    .filter((line) => line !== null)
    .join("\n")
}

async function source(name) {
  const file = `${name}.tsx`
  const local = [
    // shadcn installs copy the file into the project; the package ships its src
    "components/animated-icons/icons",
    "src/components/animated-icons/icons",
    `node_modules/${PACKAGE}/src/icons`,
  ]
    .map((dir) => findUp(join(dir, file)))
    .find(Boolean)
  if (local) return { code: readFileSync(local, "utf8"), from: local }
  const url = `${RAW}/${file}`
  const response = await fetch(url)
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`)
  return { code: await response.text(), from: url }
}

// ---------- main ----------

try {
  const { catalog, from } = await loadCatalog()
  const site = catalog.site ?? SITE
  let icons = catalog.icons
  if (flags.category) icons = icons.filter((icon) => icon.category === flags.category)
  if (flags.colors) icons = icons.filter((icon) => icon.colors === Number(flags.colors))
  const byName = (name) => {
    const icon = catalog.icons.find((entry) => entry.name === name || entry.component === name)
    if (!icon) throw new Error(`no icon named "${name}". Search for it: find-icon.mjs ${name.replace(/-/g, " ")}`)
    return icon
  }
  const out = (data, text) => console.log(flags.json ? JSON.stringify(data, null, 2) : text)

  if (flags.source) {
    const { code, from: file } = await source(byName(flags.source).name)
    console.log(`// ${file}\n${code}`)
  } else if (flags.show) {
    const icon = byName(flags.show)
    out({ ...icon, siblings: siblingsOf(catalog.icons, icon) }, detail(catalog.icons, icon, site))
  } else if (flags.list) {
    const categories = [...new Set(catalog.icons.map((icon) => icon.category))].sort()
    out(
      icons.map(({ name, category, keywords, variants }) => ({ name, category, keywords, variants })),
      [
        `${icons.length} icons (catalog ${catalog.version}, ${from})`,
        `categories: ${categories.join(", ")}`,
        "",
        ...icons.map((icon) => `${icon.name} [${icon.category}] ${icon.keywords.join(", ")}`),
      ].join("\n"),
    )
  } else {
    const query = words.join(" ")
    const hits = search(icons, query).slice(0, Number(flags.limit ?? 8))
    out(
      hits.map(({ icon, score }) => ({ ...icon, score })),
      hits.length
        ? `${hits.length} best for "${query}" (catalog ${catalog.version}):\n\n${hits.map(({ icon }) => summary(catalog.icons, icon)).join("\n\n")}`
        : `Nothing matched "${query}". Try the object the icon would show (a bell, not "alerts"), a synonym, or --list to scan every icon.`,
    )
  }
} catch (error) {
  console.error(`find-icon: ${error.message}`)
  process.exit(1)
}
