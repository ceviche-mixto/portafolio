/**
 * Única fuente de verdad para identidad y enlaces externos del sitio.
 *
 * Si algo del sitio apunta hacia fuera, su URL vive aquí y en ningún otro
 * archivo. Los valores marcados con REVISAR son los que debes confirmar tú:
 * están puestos con el mejor valor deducible del repositorio, no inventados.
 */

/** Dominio canónico. Necesario para metadataBase, sitemap e imágenes OG. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ??
  'https://giancarlolarios.dev' // REVISAR: dominio definitivo del portafolio

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
 * Proyectos. `demo: null` oculta el botón "Ver en vivo" en lugar de renderizar
 * un enlace roto, así que es seguro dejarlo así hasta que tengas la URL.
 */
export const PROJECTS = {
  gradeo: {
    repo: 'https://github.com/ceviche-mixto/gradeo', // REVISAR: nombre real del repo
    demo: null as string | null, // REVISAR: URL de producción de GRADEO
  },
  farmaplus: {
    repo: 'https://github.com/ceviche-mixto/farmaplus', // REVISAR: nombre real del repo
    demo: null as string | null, // REVISAR: URL de producción de FARMAPLUS
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
