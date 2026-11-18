import { HeroSection } from "@/features/hero/HeroSection"
import { CVSection } from "@/components/cv/CVSection"
import { GradeoSection } from "@/features/gradeo/GradeoSection"
import { ProjectsSection } from "@/features/projects/ProjectsSection"
import { ContactSection } from "@/features/contact/ContactSection"
import { SiteFooter } from "@/features/contact/SiteFooter"
import type { Language } from "@/lib/language"

/** Portada, idéntica en estructura para cada idioma. */
export function HomePage({ lang }: { lang: Language }) {
  return (
    <>
      <main id="contenido" tabIndex={-1} className="relative overflow-clip">
        <HeroSection lang={lang} />
        <CVSection lang={lang} />
        <GradeoSection lang={lang} />
        <ProjectsSection lang={lang} />
        <ContactSection lang={lang} />
      </main>
      <SiteFooter lang={lang} />
    </>
  )
}
