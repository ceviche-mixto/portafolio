import type { MetadataRoute } from "next"
import { PROJECTS, projectPath } from "@/content/projects"
import { HOME_PATH, htmlLang, type Language } from "@/lib/language"
import { SITE_URL } from "@/lib/site"

/** Última revisión del contenido de la portada. Se actualiza a mano al cambiarlo. */
const HOME_UPDATED = "2026-11-18"

/**
 * Portada y casos en los dos idiomas (8 URLs), cada una con su alternante. Las
 * fechas son las de la última revisión del contenido, no la hora del build:
 * así un despliegue sin cambios no anuncia contenido nuevo.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { paths: Record<Language, string>; updated: string; priority: number }[] = [
    { paths: HOME_PATH, updated: HOME_UPDATED, priority: 1 },
    ...PROJECTS.map((project) => ({
      paths: { es: projectPath("es", project.slug), en: projectPath("en", project.slug) },
      updated: project.evidence.asOf,
      priority: 0.8,
    })),
  ]
  return pages.flatMap(({ paths, updated, priority }) => {
    const languages = {
      [htmlLang("es")]: `${SITE_URL}${paths.es}`,
      [htmlLang("en")]: `${SITE_URL}${paths.en}`,
    }
    return (["es", "en"] as const).map((lang) => ({
      url: `${SITE_URL}${paths[lang]}`,
      lastModified: updated,
      changeFrequency: "monthly" as const,
      priority,
      alternates: { languages },
    }))
  })
}
