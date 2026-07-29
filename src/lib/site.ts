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
 *   2. Las variables de sistema de Vercel — el dominio de producción real del
 *      proyecto, expuesto automáticamente en cada despliegue.
 *   3. localhost, para desarrollo.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return explicit.replace(/\/$/, '')

  const vercelHost =
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (vercelHost) return `https://${vercelHost.replace(/\/$/, '')}`

  return 'http://localhost:3000'
}

export const SITE_URL = resolveSiteUrl()

/** Identidad. Un solo título profesional, usado en todo el sitio (ver C-03). */
export const IDENTITY = {
  name: 'Giancarlo Larios',
  fullName: 'Giancarlo Larios Infantes',
  /**
   * Un único título, repetido literal en hero, CV, consola y metadatos.
   * Se elige "estudiante" porque es verificable hoy; cámbialo cuando titules.
   */
  titleEs: 'Estudiante de Ingeniería de Sistemas y Computación',
  titleEn: 'Information Systems Engineering Student',
  university: 'Universidad Católica Santo Toribio de Mogrovejo (USAT)',
  location: { es: 'Chiclayo, Perú', en: 'Chiclayo, Peru' },
  email: 'cevichito.mixto3011@gmail.com', // REVISAR: ¿es el correo que quieres público?
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
    demo: null as string | null,
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

/** CV en PDF por idioma. Los archivos van en /public/cv/. */
export const CV_FILES = {
  es: '/cv/giancarlo-larios-cv-es.pdf',
  en: '/cv/giancarlo-larios-cv-en.pdf',
} as const

/** Anclas de la navegación. El id debe existir como `id` en la sección. */
export const NAV_SECTIONS = [
  { id: 'perfil', es: 'Perfil', en: 'Profile' },
  { id: 'gradeo', es: 'GRADEO', en: 'GRADEO' },
  { id: 'proyectos', es: 'Proyectos', en: 'Projects' },
  { id: 'contacto', es: 'Contacto', en: 'Contact' },
] as const
