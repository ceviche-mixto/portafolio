import 'server-only'

import type { Metadata } from 'next'
import { translations } from './i18n'
import { HOME_PATH, htmlLang, type Language } from './language'
import { IDENTITY, SITE_URL } from './site'

const OG_LOCALE: Record<Language, string> = { es: 'es_PE', en: 'en_US' }

/**
 * Canonical propio y alternantes cruzados. `x-default` apunta al español, que es
 * el idioma de la portada raíz.
 */
function alternates(paths: Record<Language, string>, lang: Language): Metadata['alternates'] {
  return {
    canonical: paths[lang],
    languages: {
      [htmlLang('es')]: paths.es,
      [htmlLang('en')]: paths.en,
      'x-default': paths.es,
    },
  }
}

/** Metadatos de la portada de cada idioma. */
export function homeMetadata(lang: Language): Metadata {
  const other: Language = lang === 'es' ? 'en' : 'es'
  const title = `${IDENTITY.name} — ${lang === 'es' ? IDENTITY.titleEs : IDENTITY.titleEn}`
  const description = translations[lang].hero.subtitle

  return {
    // Sin metadataBase las URLs de Open Graph quedan relativas y las redes
    // sociales no las resuelven.
    metadataBase: new URL(SITE_URL),
    title,
    description,
    applicationName: `${IDENTITY.name} — Portafolio`,
    authors: [{ name: IDENTITY.fullName, url: SITE_URL }],
    creator: IDENTITY.fullName,
    keywords: [
      'Giancarlo Larios',
      'ingeniería de sistemas',
      'Next.js',
      'Postgres',
      'Supabase',
      'GRADEO',
      'FARMAPLUS',
      'desarrollador de software',
      'desarrollo web',
      'automatización',
    ],
    alternates: alternates(HOME_PATH, lang),
    openGraph: {
      type: 'profile',
      title,
      description,
      url: HOME_PATH[lang],
      siteName: `${IDENTITY.name} — Portafolio`,
      locale: OG_LOCALE[lang],
      alternateLocale: OG_LOCALE[other],
    },
    twitter: { card: 'summary_large_image', title, description },
    robots: { index: true, follow: true },
  }
}
