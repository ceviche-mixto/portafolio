import 'server-only'

import type { Metadata } from 'next'
import { projectPath, type Project } from '@/content/projects'
import { translations } from './i18n'
import { HOME_PATH, htmlLang, type Language } from './language'
import { IDENTITY, SITE_URL } from './site'

const OG_LOCALE: Record<Language, string> = { es: 'es_PE', en: 'en_US' }
const SITE_NAME = `${IDENTITY.name} — Portafolio`

/**
 * Metadatos comunes de una página con equivalente en el otro idioma: canonical
 * propio y alternantes cruzados. `x-default` apunta al español, que es el
 * idioma de la portada raíz.
 */
function pageMetadata({
  lang,
  paths,
  title,
  description,
  type,
  images,
}: {
  lang: Language
  paths: Record<Language, string>
  title: string
  description: string
  type: 'profile' | 'article'
  images?: { url: string; width: number; height: number; alt: string }[]
}): Metadata {
  return {
    // Sin metadataBase las URLs de Open Graph quedan relativas y las redes
    // sociales no las resuelven.
    metadataBase: new URL(SITE_URL),
    title,
    description,
    applicationName: SITE_NAME,
    authors: [{ name: IDENTITY.fullName, url: SITE_URL }],
    creator: IDENTITY.fullName,
    alternates: {
      canonical: paths[lang],
      languages: {
        [htmlLang('es')]: paths.es,
        [htmlLang('en')]: paths.en,
        'x-default': paths.es,
      },
    },
    openGraph: {
      type,
      title,
      description,
      url: paths[lang],
      siteName: SITE_NAME,
      locale: OG_LOCALE[lang],
      alternateLocale: OG_LOCALE[lang === 'es' ? 'en' : 'es'],
      ...(images ? { images } : {}),
    },
    twitter: { card: 'summary_large_image', title, description },
    robots: { index: true, follow: true },
  }
}

/** Portada de cada idioma; la imagen OG la aporta `opengraph-image.tsx`. */
export function homeMetadata(lang: Language): Metadata {
  return pageMetadata({
    lang,
    paths: HOME_PATH,
    title: `${IDENTITY.name} — ${lang === 'es' ? IDENTITY.titleEs : IDENTITY.titleEn}`,
    description: translations[lang].hero.subtitle,
    type: 'profile',
  })
}

/** Página de un caso, con su captura como tarjeta. */
export function caseMetadata(lang: Language, project: Project): Metadata {
  const { cover } = project
  return pageMetadata({
    lang,
    paths: { es: projectPath('es', project.slug), en: projectPath('en', project.slug) },
    title: `${project.name}: ${project.headline[lang]} — ${IDENTITY.name}`,
    description: project.summary[lang],
    type: 'article',
    images: [{ url: cover.src, width: cover.width, height: cover.height, alt: cover.alt[lang] }],
  })
}
