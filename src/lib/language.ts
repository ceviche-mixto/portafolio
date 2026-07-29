import type { Language } from './i18n'

/**
 * Parte compartida del manejo de idioma: sin dependencias de servidor, así que
 * puede importarse desde componentes cliente.
 *
 * La lectura de la cookie vive en `language-server.ts`. Están separados porque
 * `next/headers` sólo existe en el servidor: tenerlo aquí metía todo el módulo en
 * el bundle del cliente a través de `LanguageProvider` y rompía el build.
 */

/**
 * El idioma se guarda en cookie, no en localStorage, porque el servidor necesita
 * conocerlo para emitir el `<html lang>` correcto y los metadatos en el idioma
 * que verá el visitante (ver A-01 y S-02).
 */
export const LANGUAGE_COOKIE = 'lang'

/** Un año: la preferencia de idioma no caduca de forma útil antes. */
export const LANGUAGE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

/** Etiqueta BCP 47 para `<html lang>` y `hreflang`. */
export function htmlLang(lang: Language): string {
  return lang === 'es' ? 'es-PE' : 'en'
}
