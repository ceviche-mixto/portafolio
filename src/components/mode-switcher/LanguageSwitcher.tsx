"use client"

import { usePathname } from "next/navigation"
import { Languages } from "lucide-react"
import { equivalentPath, htmlLang, type Language } from "@/lib/language"

/**
 * Enlace a la misma página en el otro idioma.
 *
 * El texto visible es el código del idioma de destino y el nombre accesible
 * empieza por él, así que quien usa control por voz puede decir lo que ve
 * (WCAG 2.5.3). `lang` marca el destino para que se pronuncie bien. Cada idioma
 * tiene su propio documento, así que el cambio es una navegación completa.
 */
export function LanguageSwitcher({
  lang,
  label,
  name,
}: {
  lang: Language
  label: string
  name: string
}) {
  const target: Language = lang === "es" ? "en" : "es"
  const pathname = usePathname()

  return (
    <a
      href={equivalentPath(pathname ?? "/", target)}
      hrefLang={htmlLang(target)}
      lang={htmlLang(target)}
      className="tactile flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-bold text-subtle transition-colors hover:border-strong hover:text-foreground md:text-sm"
    >
      <Languages className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      <span>{label}</span>
      <span className="sr-only">, {name}</span>
    </a>
  )
}
