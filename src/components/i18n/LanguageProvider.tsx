"use client"

import * as React from 'react'
import { translations, type Language, type TranslationDict } from '@/lib/i18n'
import { LANGUAGE_COOKIE, LANGUAGE_COOKIE_MAX_AGE } from '@/lib/language'

type LanguageContextValue = {
  lang: Language
  t: TranslationDict
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
}

const LanguageContext = React.createContext<LanguageContextValue | null>(null)

/**
 * El idioma vive en contexto, no en un store global, porque el valor inicial lo
 * decide el servidor a partir de la cookie. Así el primer render del cliente ya
 * coincide con el HTML y no hay desajuste de hidratación.
 */
export function LanguageProvider({
  initialLanguage,
  children,
}: {
  initialLanguage: Language
  children: React.ReactNode
}) {
  const [lang, setLang] = React.useState<Language>(initialLanguage)

  const setLanguage = React.useCallback((next: Language) => {
    setLang(next)
    document.cookie = `${LANGUAGE_COOKIE}=${next};path=/;max-age=${LANGUAGE_COOKIE_MAX_AGE};samesite=lax`
    // El servidor ya emitió un `lang`; al cambiar en cliente hay que mantenerlo
    // sincronizado para lectores de pantalla y separación de sílabas.
    document.documentElement.lang = next === 'es' ? 'es-PE' : 'en'
  }, [])

  const value = React.useMemo<LanguageContextValue>(
    () => ({
      lang,
      t: translations[lang],
      setLanguage,
      toggleLanguage: () => setLanguage(lang === 'es' ? 'en' : 'es'),
    }),
    [lang, setLanguage]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage(): LanguageContextValue {
  const ctx = React.useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguage debe usarse dentro de <LanguageProvider>')
  }
  return ctx
}
