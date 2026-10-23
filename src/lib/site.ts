/**
 * Única fuente de verdad para identidad y enlaces externos del sitio.
 *
 * Si algo del sitio apunta hacia fuera, su URL vive aquí y en ningún otro
 * archivo. Los valores marcados con REVISAR son los que debes confirmar tú:
 * están puestos con el mejor valor deducible del repositorio, no inventados.
 */

/**
 * Dominio canónico, para `metadataBase`, sitemap e imágenes Open Graph.
 *
 * Se resuelve en cadena para que sea correcto en cada entorno sin configurar
 * nada. Antes había aquí un dominio de ejemplo, que es peor que no tener
 * ninguno: publica URLs absolutas que no existen.
 *
 *   1. NEXT_PUBLIC_SITE_URL — tu dominio propio, cuando lo tengas.
 *   2. El dominio público confirmado del portafolio. Los previews también deben
 *      apuntar al sitio publicado, no convertirse en páginas canónicas nuevas.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return explicit.replace(/\/$/, '')

  return 'https://portafolio-giancarlo-larios.vercel.app'
}

export const SITE_URL = resolveSiteUrl()

/** Identidad. Un solo título profesional, usado en todo el sitio (ver C-03). */
export const IDENTITY = {
  name: 'Giancarlo Larios',
  fullName: 'Giancarlo Larios Infantes',
  /**
   * Un único título, repetido literal en hero, CV, consola y metadatos.
   * Describe el trabajo realizado; la formación académica se explica en el PDF.
   */
  titleEs: 'Desarrollador de software',
  titleEn: 'Software developer',
  university: 'Universidad Católica Santo Toribio de Mogrovejo (USAT)',
  email: 'giancarlolarios123@gmail.com',
} as const

/** Perfiles. El orden es el orden de aparición: GitHub primero (ver U-01). */
export const SOCIALS = {
  github: 'https://github.com/ceviche-mixto',
  linkedin: 'https://www.linkedin.com/in/giancarlo-larios-infantes/',
  instagram:
    'https://www.instagram.com/giancarlolarios_?igsh=MXBhbmJycGxpOTU5eQ%3D%3D&utm_source=qr',
} as const

/**
 * Proyectos.
 *
 * `null` oculta el botón correspondiente en lugar de renderizar un enlace roto
 * (ver `ProjectLinks`). Un enlace que da 404 a un reclutador es peor que no
 * ofrecer enlace, así que aquí sólo va lo que existe y es público.
 *
 * Estado comprobado el 29 de julio de 2026:
 * - `ceviche-mixto/gradeo` existe pero es **privado**: un visitante vería un 404,
 *   así que el enlace queda oculto. Si haces el repositorio público, cambia
 *   `repo` por la URL y el botón aparece solo.
 * - FARMAPLUS todavía no tiene repositorio en la cuenta. Cuando lo publiques,
 *   pon aquí su URL.
 */
export const PROJECTS = {
  gradeo: {
    // https://github.com/ceviche-mixto/gradeo — privado ahora mismo.
    repo: null as string | null,
    demo: 'https://gradeo.vercel.app' as string | null,
    /**
     * Sin enlace público, en lugar de callar se ofrece la vía real: el código
     * está y se puede compartir en una entrevista. Ponlo en `false` cuando el
     * repositorio sea público y el botón lo sustituya.
     */
    codeOnRequest: true,
  },
  farmaplus: {
    repo: null as string | null,
    demo: null as string | null,
    codeOnRequest: true,
  },
} as const

/**
 * CV en PDF por idioma. Los archivos van en /public/cv/.
 * Actualizar la revisión al sustituir un PDF, también para visitas que aún
 * conservan la política de caché de una publicación anterior.
 */
export const CV_FILES = {
  es: '/cv/giancarlo-larios-cv-es.pdf?v=20261023',
  en: '/cv/giancarlo-larios-cv-en.pdf?v=20261023',
} as const

/** Anclas de la navegación. El id debe existir como `id` en la sección. */
export const NAV_SECTIONS = [
  { id: 'perfil', es: 'Perfil', en: 'Profile' },
  { id: 'gradeo', es: 'GRADEO', en: 'GRADEO' },
  { id: 'proyectos', es: 'Proyectos', en: 'Projects' },
  { id: 'contacto', es: 'Contacto', en: 'Contact' },
] as const
