import { HeroSection } from "@/features/hero/HeroSection"
import { ProjectsSection } from "@/features/projects/ProjectsSection"
import { EngineeringSection } from "@/features/engineering/EngineeringSection"
import { TrajectorySection } from "@/features/trajectory/TrajectorySection"
import { ContactSection } from "@/features/contact/ContactSection"
import { SiteFooter } from "@/features/contact/SiteFooter"
import type { Language } from "@/lib/language"

/**
 * Portada, idéntica en estructura para cada idioma: prueba real, trabajo
 * seleccionado, enfoque de ingeniería, trayectoria y contacto.
 */
export function HomePage({ lang }: { lang: Language }) {
  return (
    <>
      <main id="contenido" tabIndex={-1} className="relative overflow-x-clip">
        <HeroSection lang={lang} />
        <ProjectsSection lang={lang} />
        <EngineeringSection lang={lang} />
        <TrajectorySection lang={lang} />
        <ContactSection lang={lang} />
      </main>
      <SiteFooter lang={lang} />
    </>
  )
}
