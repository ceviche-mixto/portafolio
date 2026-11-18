import { Languages } from "lucide-react"
import { translations } from "@/lib/i18n"
import { HOME_PATH, htmlLang, type Language } from "@/lib/language"

/**
 * Enlace a la misma página en el otro idioma.
 *
 * El texto visible es el código del idioma de destino y el nombre accesible
 * empieza por él, así que quien usa control por voz puede decir lo que ve
 * (WCAG 2.5.3). `lang` marca el destino para que se pronuncie bien.
 */
export function LanguageSwitcher({ lang, href }: { lang: Language; href?: string }) {
  const target: Language = lang === "es" ? "en" : "es"
  const { switchLabel, switchName } = translations[lang].lang

  return (
    <a
      href={href ?? HOME_PATH[target]}
      hrefLang={htmlLang(target)}
      lang={htmlLang(target)}
      className="flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-bold text-subtle transition-colors hover:border-strong hover:text-foreground md:text-sm"
    >
      <Languages className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      {switchLabel}
      <span className="sr-only">, {switchName}</span>
    </a>
  )
}
