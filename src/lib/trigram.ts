/**
 * Búsqueda por trigramas tal como la ejecuta GRADEO en producción, comprobado
 * el 21 de noviembre de 2026: pg_trgm 1.6, sin `unaccent`, base en
 * en_US.UTF-8 y `search_professors_similarity()` con umbral 0,1, `%` o
 * `ilike '%q%'`, orden por `similarity()`.
 *
 * Como pg_trgm: minúsculas, palabras = secuencias alfanuméricas (la tilde
 * cuenta: «í» no es «i»), cada palabra con dos espacios delante y uno detrás,
 * conjunto de trigramas y similitud = compartidos / unión.
 */
export const SIMILARITY_THRESHOLD = 0.1

const WORD = /[\p{L}\p{N}]+/gu

/** Un trigrama y los caracteres del texto que cubre, sin el relleno. */
type Gram = { gram: string; from: number; to: number }

function grams(text: string): Gram[] {
  const out: Gram[] = []
  for (const match of text.toLowerCase().matchAll(WORD)) {
    const chars = [" ", " ", ...match[0], " "]
    const end = match.index + match[0].length
    for (let i = 0; i + 3 <= chars.length; i++) {
      const start = match.index + i - 2
      out.push({ gram: chars.slice(i, i + 3).join(""), from: Math.max(start, match.index), to: Math.min(start + 3, end) })
    }
  }
  return out
}

export function trigrams(text: string): Set<string> {
  return new Set(grams(text).map((g) => g.gram))
}

export function similarity(a: string, b: string): number {
  const A = trigrams(a)
  const B = trigrams(b)
  if (A.size === 0 || B.size === 0) return 0
  let shared = 0
  for (const gram of A) if (B.has(gram)) shared++
  return shared / (A.size + B.size - shared)
}

/**
 * Qué caracteres de `name` forman parte de un trigrama compartido con
 * `query`, para resaltarlos. Ignora el relleno de espacios.
 */
export function sharedMask(name: string, query: string): boolean[] {
  const target = trigrams(query)
  const mask = Array.from({ length: name.length }, () => false)
  for (const { gram, from, to } of grams(name)) {
    if (target.has(gram)) for (let k = from; k < to; k++) mask[k] = true
  }
  return mask
}

export type Match = { name: string; score: number }

/**
 * `where name % q or name ilike '%' || q || '%' order by similarity desc`.
 * shortcut: `ilike` se trata como subcadena literal; `%` y `_` de la consulta
 * no actúan como comodines, igual da con nombres de ejemplo.
 */
export function search(names: readonly string[], query: string, limit: number): Match[] {
  const q = query.trim()
  if (!q) return []
  return names
    .map((name) => ({ name, score: similarity(name, q) }))
    .filter(({ name, score }) => score >= SIMILARITY_THRESHOLD || name.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
    .slice(0, limit)
}
