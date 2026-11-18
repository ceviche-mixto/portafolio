import { notFound } from "next/navigation"
import { SiteFooter } from "@/features/contact/SiteFooter"
import { getProject } from "@/content/projects"
import type { Language } from "@/lib/language"
import { CaseStudyArticle } from "./CaseStudyArticle"
import { GradeoLiveMetrics } from "./GradeoLiveMetrics"

/** Página completa de un caso, compartida por las rutas de cada idioma. */
export function CaseStudyPage({ lang, slug }: { lang: Language; slug: string }) {
  const project = getProject(slug)
  if (!project) notFound()

  return (
    <>
      <main id="contenido" tabIndex={-1} className="relative overflow-x-clip">
        <CaseStudyArticle
          project={project}
          lang={lang}
          live={project.slug === "gradeo" ? <GradeoLiveMetrics lang={lang} /> : undefined}
        />
      </main>
      <SiteFooter lang={lang} />
    </>
  )
}
