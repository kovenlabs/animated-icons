import { readdir, readFile } from "node:fs/promises"
import path from "node:path"

import { codeToHtml } from "shiki"

// The source shown in the catalog is the real file that ships, highlighted at build time.
const ICONS = path.resolve(process.cwd(), "../../packages/animated-icons/src/icons")

export const dynamic = "force-static"

async function iconNames() {
  return (await readdir(ICONS)).filter((file) => file.endsWith(".tsx")).map((file) => file.replace(/\.tsx$/, ""))
}

export async function generateStaticParams() {
  return (await iconNames()).map((name) => ({ name }))
}

export async function GET(_request: Request, { params }: RouteContext<"/api/source/[name]">) {
  const { name } = await params
  if (!(await iconNames()).includes(name)) return new Response("Not found", { status: 404 })

  const code = await readFile(path.join(ICONS, `${name}.tsx`), "utf8")
  const html = await codeToHtml(code, { lang: "tsx", themes: { light: "github-light", dark: "github-dark" } })
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } })
}
