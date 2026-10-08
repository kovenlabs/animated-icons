import { Hero } from "@/components/landing/hero"
import { IconWall } from "@/components/landing/icon-wall"
import { Install } from "@/components/landing/install"
import { ProjectStatus } from "@/components/landing/project-status"
import { Triggers } from "@/components/landing/triggers"
import { TuningBar } from "@/components/landing/tuning-bar"
import { SiteFooter } from "@/components/site-footer"
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/seo"
import { GITHUB_URL, SITE_URL } from "@/lib/site"

// metadata comes from the root layout: a page-level `openGraph` would drop the opengraph-image file's tags

// structured data: lets search engines show the library as software, with its repo and price
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareSourceCode",
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  codeRepository: GITHUB_URL,
  programmingLanguage: ["TypeScript", "React"],
  runtimePlatform: "React 19",
  license: "https://opensource.org/licenses/MIT",
  author: { "@type": "Organization", name: "Kovenlabs", url: GITHUB_URL },
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
}

export default function LandingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="flex flex-col">
          <Hero status={<ProjectStatus />} />
          <TuningBar />
          <IconWall />
          <Triggers />
        <Install />
      </main>
      <SiteFooter />
    </>
  )
}
