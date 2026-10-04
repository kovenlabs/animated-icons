// The published entry must load in plain Node (tests, SSR without a bundler), not only in bundlers.
const lib = await import("../dist/index.js")
// each icon is exported as Bell and as BellIcon (an alias for name collisions): count the aliases
const icons = Object.entries(lib).filter(([name, value]) => /^[A-Z]\w*Icon$/.test(name) && typeof value === "function")
if (icons.some(([name, value]) => lib[name.replace(/Icon$/, "")] !== value)) throw new Error("an XIcon alias does not match its X export")
if (icons.length === 0) throw new Error("dist/index.js exports no icons")
const bell = await import("../dist/icons/bell.js")
if (typeof bell.Bell !== "function") throw new Error("deep import dist/icons/bell.js is broken")
console.log(`dist OK in plain Node: ${icons.length} icons, deep imports work`)
