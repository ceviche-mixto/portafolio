import 'server-only'

import { cookies } from 'next/headers'
import { DEFAULT_LANGUAGE, isLanguage, type Language } from './i18n'
import { LANGUAGE_COOKIE } from './language'

/**
 * Lee el idioma de la cookie en el servidor.
 *
 * `server-only` hace que importar esto desde un componente cliente falle en el
 * build con un mensaje claro, en lugar de arrastrar `next/headers` al bundle del
 * navegador.
 */
export async function getLanguage(): Promise<Language> {
  const store = await cookies()
  const value = store.get(LANGUAGE_COOKIE)?.value
  return isLanguage(value) ? value : DEFAULT_LANGUAGE
}
