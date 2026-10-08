import { GITHUB_URL } from "@/lib/site"

const PACKAGE = "@kovenlabs/animated-icons"
const NPM_URL = `https://www.npmjs.com/package/${PACKAGE}`
// re-read hourly: fresh enough for a version and a star count, and well inside GitHub's anonymous rate limit
const HOURLY = { next: { revalidate: 3600 } }

interface Status {
  version?: string
  published?: string
  downloads?: number
  stars?: number
  pushed?: string
}

async function json<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, { ...HOURLY, headers: { accept: "application/json" } })
    return response.ok ? ((await response.json()) as T) : null
  } catch {
    return null
  }
}

async function getStatus(): Promise<Status> {
  const [registry, downloads, repo] = await Promise.all([
    json<{ "dist-tags"?: { latest?: string }; time?: Record<string, string> }>(`https://registry.npmjs.org/${PACKAGE}`),
    json<{ downloads?: number }>(`https://api.npmjs.org/downloads/point/last-week/${PACKAGE}`),
    json<{ stargazers_count?: number; pushed_at?: string }>(GITHUB_URL.replace("github.com", "api.github.com/repos")),
  ])
  const version = registry?.["dist-tags"]?.latest
  return {
    version,
    published: version ? registry?.time?.[version] : undefined,
    downloads: downloads?.downloads,
    stars: repo?.stargazers_count,
    pushed: repo?.pushed_at,
  }
}

const count = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 })

function ago(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000)
  if (days < 1) return "today"
  if (days === 1) return "yesterday"
  if (days < 30) return `${days} days ago`
  const months = Math.floor(days / 30)
  return months === 1 ? "a month ago" : `${months} months ago`
}

function Stat({ href, value, label }: { href: string; value: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-0.5 bg-background px-4 py-3 transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--keyline)]"
    >
      <span className="text-lg font-semibold tracking-tight whitespace-nowrap tabular-nums">{value}</span>
      <span className="text-xs text-muted-foreground group-hover:text-foreground">{label}</span>
    </a>
  )
}

/** Live numbers from npm and GitHub. Whatever a source can't answer is left out, never shown as zero. */
export async function ProjectStatus() {
  const { version, published, downloads, stars, pushed } = await getStatus()
  const stats = [
    version && {
      href: NPM_URL,
      value: `v${version}`,
      label: published ? `on npm, published ${ago(published)}` : "on npm",
    },
    downloads !== undefined && { href: NPM_URL, value: count.format(downloads), label: "npm downloads last week" },
    stars !== undefined && { href: GITHUB_URL, value: count.format(stars), label: "stars on GitHub" },
    pushed && {
      href: `${GITHUB_URL}/commits`,
      value: ago(pushed).replace(/^./, (c) => c.toUpperCase()),
      label: "last push to GitHub",
    },
  ].filter((stat): stat is { href: string; value: string; label: string } => Boolean(stat))

  if (stats.length === 0) return null
  return (
    <div className="grid max-w-[36rem] grid-cols-2 gap-px border bg-border sm:grid-cols-[1.5fr_1fr_1fr_1fr]">
      {stats.map((stat) => (
        <Stat key={stat.label} {...stat} />
      ))}
    </div>
  )
}
