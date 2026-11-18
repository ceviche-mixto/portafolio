import type { MetadataRoute } from "next"
import { HOME_PATH } from "@/lib/language"
import { SITE_URL } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = { "es-PE": `${SITE_URL}${HOME_PATH.es}`, en: `${SITE_URL}${HOME_PATH.en}` }
  return (["es", "en"] as const).map((lang) => ({
    url: `${SITE_URL}${HOME_PATH[lang]}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 1,
    alternates: { languages },
  }))
}
