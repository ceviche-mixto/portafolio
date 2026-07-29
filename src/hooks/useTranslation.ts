"use client"

import { useLanguage } from '@/components/i18n/LanguageProvider'
import type { Language, TranslationDict } from '@/lib/i18n'

/** Azúcar sobre `useLanguage` para los componentes que sólo leen traducciones. */
export function useTranslation(): { t: TranslationDict; lang: Language } {
  const { t, lang } = useLanguage()
  return { t, lang }
}
