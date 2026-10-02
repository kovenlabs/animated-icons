import { Features } from "@/components/landing/features"
import { Hero } from "@/components/landing/hero"
import { IconWall } from "@/components/landing/icon-wall"
import { OwnIt } from "@/components/landing/own-it"
import { SiteFooter } from "@/components/site-footer"

export default function LandingPage() {
  return (
    <>
      <main className="flex flex-col">
        <Hero />
        <IconWall />
        <Features />
        <OwnIt />
      </main>
      <SiteFooter />
    </>
  )
}
