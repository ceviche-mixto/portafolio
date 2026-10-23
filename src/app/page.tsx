import { HeroSection } from "@/features/hero/HeroSection"
import { CVSection } from "@/components/cv/CVSection"
import { GradeoSection } from "@/features/gradeo/GradeoSection"
import { ProjectsSection } from "@/features/projects/ProjectsSection"
import { ContactSection } from "@/features/contact/ContactSection"
import { SiteFooter } from "@/features/contact/SiteFooter"
import { getGradeoStats } from "@/lib/gradeo-stats"
import { Suspense } from "react"
import { GRADEO_STATS_EMPTY } from "@/lib/gradeo-stats"

/**
 * La página vuelve a ser un Server Component.
 *
 * Antes empezaba con `"use client"`, así que todo el árbol se renderizaba en el
 * navegador y las métricas de GRADEO se pedían después de hidratar. Ahora los
 * datos se resuelven aquí y viajan ya renderizados en el HTML (ver P-04).
 */
// Next exige que esto sea un literal analizable estáticamente, así que no puede
// venir de `GRADEO_STATS_REVALIDATE`. Cinco minutos: son datos de escaparate, y
// así una visita no golpea la base de producción de GRADEO.
export const revalidate = 300

async function GradeoWithData() {
  const stats = await getGradeoStats()
  return <GradeoSection stats={stats} />
}

export default function Home() {
  return (
    <>
    <main id="contenido" tabIndex={-1} className="relative overflow-clip">
      <HeroSection />
      <CVSection />
      <Suspense fallback={<GradeoSection stats={{ ...GRADEO_STATS_EMPTY, pending: true }} />}>
        <GradeoWithData />
      </Suspense>
      <ProjectsSection />
      <ContactSection />
    </main>
    <SiteFooter />
    </>
  )
}
