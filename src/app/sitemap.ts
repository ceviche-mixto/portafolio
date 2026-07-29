import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      // El sitio es una sola URL que cambia de idioma por cookie, así que ambas
      // alternativas apuntan a la raíz; lo que importa es declarar que existen.
      alternates: { languages: { "es-PE": SITE_URL, en: SITE_URL } },
    },
  ]
}
