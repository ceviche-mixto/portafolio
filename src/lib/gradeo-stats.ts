import { getSupabase } from './supabase'

export type TopProfessor = { name: string; score: string }

export type GradeoStats = {
  /** Reseñas aprobadas. `null` si no se pudo consultar. */
  reviews: number | null
  /** Profesores indexados. `null` si no se pudo consultar. */
  professors: number | null
  topProfessors: TopProfessor[]
  /** Distingue "sin datos todavía" de "no hay conexión". */
  live: boolean
}

const EMPTY: GradeoStats = {
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

/**
 * Consulta las métricas en el servidor.
 *
 * Antes esto ocurría en el navegador tras hidratar, con las tarjetas mostrando
 * "..." antes de saltar al número. Al resolverlo en el servidor el número real
 * ya viaja en el HTML: mejor LCP y sin desplazamiento de layout (ver P-04).
 *
 * Sólo cuenta reseñas aprobadas, que es lo que el trigger de GRADEO agrega y por
 * tanto lo único coherente con los puntajes que se muestran.
 */
export async function getGradeoStats(): Promise<GradeoStats> {
  const supabase = getSupabase()
  if (!supabase) return EMPTY

  try {
    const [profCount, reviewCount, topProfs] = await Promise.all([
      supabase.from('professors').select('*', { count: 'exact', head: true }),
      supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved'),
      supabase
        .from('professors')
        .select('first_name, last_name, total_score, review_count')
        .gt('review_count', 0)
        .order('total_score', { ascending: false })
        .order('review_count', { ascending: false })
        .limit(5),
    ])

    // supabase-js no lanza ante un fallo de red: devuelve `{ count: null, error }`.
    // Si diéramos `live: true` sin mirar `error`, la tarjeta anunciaría «en vivo
    // desde producción» mientras muestra guiones.
    const failed = profCount.error ?? reviewCount.error ?? topProfs.error
    if (failed) {
      console.error('[portafolio] Supabase rechazó la consulta de métricas:', failed.message)
      return EMPTY
    }

    return {
      professors: profCount.count ?? null,
      reviews: reviewCount.count ?? null,
      topProfessors: (topProfs.data ?? []).map((p) => ({
        name: [p.first_name, p.last_name].filter(Boolean).join(' ').trim(),
        score: Number(p.total_score).toFixed(1),
      })),
      live: profCount.count !== null && reviewCount.count !== null,
    }
  } catch (error) {
    // Un fallo de red no debe tumbar la página: se degrada a los valores de
    // reserva y se registra en el servidor, no en la consola del visitante.
    console.error('[portafolio] No se pudieron leer las métricas de GRADEO:', error)
    return EMPTY
  }
}
