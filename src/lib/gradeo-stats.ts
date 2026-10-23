import { getSupabase } from './supabase'
import { unstable_cache } from 'next/cache'
import { withDeadline } from './deadline'

export type TopProfessor = { name: string; score: string }

export type GradeoStats = {
  /** Reseñas aprobadas. `null` si no se pudo consultar. */
  reviews: number | null
  /** Profesores indexados. `null` si no se pudo consultar. */
  professors: number | null
  topProfessors: TopProfessor[]
  /** Distingue "sin datos todavía" de "no hay conexión". */
  live: boolean
  pending?: boolean
}

export const GRADEO_STATS_EMPTY: GradeoStats = {
  reviews: null,
  professors: null,
  topProfessors: [],
  live: false,
}

/**
 * Cada cuánto se revalida la caché de las métricas. Cinco minutos: son datos de
 * escaparate, no un panel de control, y así una visita no golpea producción.
 */
export const GRADEO_STATS_REVALIDATE = 300
export const GRADEO_STATS_TIMEOUT = 3000

/**
 * Consulta las métricas en el servidor.
 *
 * Consulta opcional en Suspense: la portada y el CV no esperan a la base.
 * Los datos se transmiten desde el servidor sin cargar Supabase en el cliente.
 *
 * Sólo cuenta reseñas aprobadas, que es lo que el trigger de GRADEO agrega y por
 * tanto lo único coherente con los puntajes que se muestran.
 */
async function readGradeoStats(): Promise<GradeoStats> {
  return withDeadline(async (signal) => {
  const supabase = getSupabase()
  if (!supabase) return GRADEO_STATS_EMPTY

  try {
    const [profCount, reviewCount, topProfs] = await Promise.all([
      supabase.from('professors').select('*', { count: 'exact', head: true }).abortSignal(signal),
      supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved').abortSignal(signal),
      supabase
        .from('professors')
        .select('first_name, last_name, total_score, review_count')
        .gt('review_count', 0)
        .order('total_score', { ascending: false })
        .order('review_count', { ascending: false })
        .limit(5).abortSignal(signal),
    ])

    // supabase-js no lanza ante un fallo de red: devuelve `{ count: null, error }`.
    // Si diéramos `live: true` sin mirar `error`, la tarjeta anunciaría «en vivo
    // desde producción» mientras muestra guiones.
    const failed = profCount.error ?? reviewCount.error ?? topProfs.error
    if (failed) {
      if (!signal.aborted) console.error('[portafolio] Supabase rechazó la consulta de métricas:', failed.message)
      return GRADEO_STATS_EMPTY
    }

    return {
      professors: profCount.count ?? null,
      reviews: reviewCount.count ?? null,
      topProfessors: (topProfs.data ?? []).map((p) => ({
        name: [p.first_name, p.last_name].filter(Boolean).join(' ').trim(),
        score: Number(p.total_score).toFixed(1),
      })).filter((p) => p.name && Number.isFinite(Number(p.score))),
      live: profCount.count !== null && reviewCount.count !== null,
    }
  } catch (error) {
    // Un fallo de red no debe tumbar la página: se degrada a los valores de
    // reserva y se registra en el servidor, no en la consola del visitante.
    if (!signal.aborted) console.error('[portafolio] No se pudieron leer las métricas de GRADEO:', error)
    return GRADEO_STATS_EMPTY
  }
  }, GRADEO_STATS_EMPTY, GRADEO_STATS_TIMEOUT)
}

// La página usa cookies de idioma y se renderiza por petición. Cachear la
// consulta pública explícitamente evita consultar producción en cada visita.
const readCachedGradeoStats = unstable_cache(async () => {
  const stats = await readGradeoStats()
  // Un fallo no debe congelar la reserva en la caché durante cinco minutos.
  if (!stats.live) throw new Error('Optional GRADEO metrics unavailable')
  return stats
}, ['gradeo-public-stats-v2'], { revalidate: GRADEO_STATS_REVALIDATE })

export async function getGradeoStats(): Promise<GradeoStats> {
  try { return await readCachedGradeoStats() }
  catch { return GRADEO_STATS_EMPTY }
}
