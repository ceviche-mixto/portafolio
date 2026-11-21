import { notFound } from "next/navigation"
import { SiteFooter } from "@/features/contact/SiteFooter"
import { getProject } from "@/content/projects"
import { JsonLd } from "@/components/seo/JsonLd"
import type { Language } from "@/lib/language"
import { caseStructuredData } from "@/lib/structured-data"
import { CaseStudyArticle } from "./CaseStudyArticle"
import { GradeoLiveMetrics } from "./GradeoLiveMetrics"
import { importPanels } from "./ImportFigure"
import { SearchDemo } from "./SearchDemo"
import { translations } from "@/lib/i18n"

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
          demo={project.slug === "gradeo" ? <SearchDemo lang={lang} copy={translations[lang].caseStudy.demo} /> : undefined}
          stepPanels={project.slug === "onectrl" ? importPanels(lang) : undefined}
        />
      </main>
      <SiteFooter lang={lang} />
      <JsonLd data={caseStructuredData(lang, project)} />
    </>
  )
}
