// Node's ESM loader needs explicit file extensions; tsup (unbundled) and tsc keep the source's
// extensionless relative imports. Rewrite them in dist/*.js and dist/*.d.ts:
//   "../lib/create-icon"  →  "../lib/create-icon.js"   (or ".../index.js" for a folder)
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const dist = fileURLToPath(new URL("../dist", import.meta.url))
const SPECIFIER = /(from\s+|import\s*\(\s*|declare module\s+|import\s+)(["'])(\.{1,2}(?:\/[^"']*)?)\2/g

function withExtension(file, specifier) {
  if (/\.(js|json)$/.test(specifier)) return specifier
  const base = resolve(dirname(file), specifier)
  // a bare "." or ".." (TypeScript infers these) means that folder's index
  if (specifier === "." || specifier === "..") return `${specifier}/index.js`
  if (existsSync(`${base}.js`)) return `${specifier}.js`
  if (existsSync(join(base, "index.js"))) return `${specifier}/index.js`
  throw new Error(`${file}: cannot resolve "${specifier}"`)
}

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? walk(path) : [path]
  })
}

let rewritten = 0
for (const file of walk(dist).filter((f) => f.endsWith(".js") || f.endsWith(".d.ts"))) {
  const source = readFileSync(file, "utf8")
  const output = source.replace(SPECIFIER, (_, lead, quote, specifier) => {
    const next = withExtension(file, specifier)
    if (next !== specifier) rewritten++
    return `${lead}${quote}${next}${quote}`
  })
  if (output !== source) writeFileSync(file, output)
}
console.log(`dist: ${rewritten} relative imports now carry extensions`)
