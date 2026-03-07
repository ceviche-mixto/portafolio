import { useLanguageStore } from '@/store/useLanguageStore'
import { translations, TranslationDict } from '@/lib/i18n'

export function useTranslation(): { t: TranslationDict; lang: 'en' | 'es' } {
  const language = useLanguageStore((state) => state.language)
  const t = translations[language]
  return { t, lang: language }
}
