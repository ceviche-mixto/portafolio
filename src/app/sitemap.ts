import type { MetadataRoute } from "next"
import { PROJECT_SLUGS, projectPath } from "@/content/projects"
import { HOME_PATH, htmlLang, type Language } from "@/lib/language"
import { SITE_URL } from "@/lib/site"

/** Portada y casos en los dos idiomas, cada URL con su alternante. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: Record<Language, string>[] = [
    HOME_PATH,
    ...PROJECT_SLUGS.map((slug) => ({ es: projectPath("es", slug), en: projectPath("en", slug) })),
  ]
  return pages.flatMap((paths) => {
    const languages = {
      [htmlLang("es")]: `${SITE_URL}${paths.es}`,
      [htmlLang("en")]: `${SITE_URL}${paths.en}`,
    }
    return (["es", "en"] as const).map((lang) => ({
      url: `${SITE_URL}${paths[lang]}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: paths === HOME_PATH ? 1 : 0.8,
      alternates: { languages },
    }))
  })
}
