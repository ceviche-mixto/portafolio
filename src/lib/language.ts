/**
 * Idioma del sitio, sin dependencias de servidor: lo pueden importar tanto
 * Server Components como islas de cliente.
 *
 * El idioma se decide por URL. Cada idioma tiene su propio árbol de rutas
 * prerenderizadas (`/` y `/en`), así que no se lee ninguna cookie al renderizar.
 */
export type Language = 'es' | 'en'

/** Etiqueta BCP 47 para `<html lang>` y `hreflang`. */
export function htmlLang(lang: Language): string {
  return lang === 'es' ? 'es-PE' : 'en'
}

/** Portada de cada idioma. */
export const HOME_PATH: Record<Language, string> = { es: '/', en: '/en' }
