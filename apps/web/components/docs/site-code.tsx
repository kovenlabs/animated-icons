import { ServerCodeBlock } from "fumadocs-ui/components/codeblock.rsc"

import { SITE_URL } from "@/lib/site"

/** A code block whose `{site}` placeholders render the site's real URL (site.config.json). */
export function SiteCode({ code, lang, title }: { code: string; lang: string; title?: string }) {
  return <ServerCodeBlock lang={lang} code={code.replaceAll("{site}", SITE_URL)} codeblock={{ title }} />
}
