"use client"

import * as React from "react"
import { Languages } from "lucide-react"
import { useLanguage } from "@/components/i18n/LanguageProvider"

/**
 * Alterna español e inglés.
 *
 * Antes el botón sólo contenía «ES» o «EN», que a un lector de pantalla no le
 * dice ni que es un conmutador ni a qué idioma lleva. La etiqueta va escrita en
 * el idioma de destino y marcada con `lang`, para que se pronuncie bien (A-06).
 */
export function LanguageSwitcher() {
  const { lang, t, toggleLanguage } = useLanguage()
  const target = lang === "es" ? "en" : "es"

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      lang={target}
      aria-label={t.lang.switchTo}
      title={t.lang.switchTo}
      className="flex items-center gap-1.5 rounded-full border border-zinc-700/60 bg-zinc-900/80 px-3 py-1.5 text-xs font-bold text-zinc-200 transition-colors hover:border-zinc-600 hover:text-white active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 md:text-sm"
    >
      <Languages className="h-4 w-4 text-zinc-400" aria-hidden="true" />
      <span aria-hidden="true">{target.toUpperCase()}</span>
    </button>
  )
}
