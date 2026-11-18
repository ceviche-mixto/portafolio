import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Cliente de sólo lectura contra la base de GRADEO.
 *
 * Se usa únicamente desde el servidor (ver `gradeo-stats.ts`): las credenciales
 * no viajan en el bundle del navegador y el esquema de GRADEO no es una
 * dependencia del cliente. Una variable ausente produce un aviso que dice cuál
 * falta, en lugar de un fallo opaco al importar.
 */
function readEnv(name: string): string | null {
  const value = process.env[name]
  return value && value.length > 0 ? value : null
}

let cached: SupabaseClient | null = null

/**
 * Devuelve el cliente, o `null` si el entorno no está configurado.
 *
 * Devolver `null` en lugar de lanzar es deliberado: el portafolio tiene que
 * renderizar aunque las métricas en vivo no estén disponibles. Quien clona el
 * repositorio sin claves ve el sitio completo con los valores de reserva.
 */
export function getSupabase(): SupabaseClient | null {
  if (cached) return cached

  const url = readEnv('NEXT_PUBLIC_SUPABASE_URL')
  const key = readEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY')

  if (!url || !key) {
    const missing = [
      !url && 'NEXT_PUBLIC_SUPABASE_URL',
      !key && 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    ].filter(Boolean)
    console.warn(
      `[portafolio] Métricas en vivo desactivadas: falta ${missing.join(' y ')}. ` +
        'Copia .env.example a .env.local para activarlas.'
    )
    return null
  }

  cached = createClient(url, key, { auth: { persistSession: false } })
  return cached
}
