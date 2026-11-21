import { describe, expect, it } from "vitest"
import { search, sharedMask, similarity, trigrams } from "@/lib/trigram"

/**
 * Valores dorados: `select similarity(a, b)` en la base de GRADEO en producción
 * (pg_trgm 1.6, sin unaccent, en_US.UTF-8) el 21 de noviembre de 2026, con
 * nombres de ejemplo.
 */
const GOLDEN: [string, string, number][] = [
  ["Lucia Morlaes", "Lucía Morales", 0.333333],
  ["Lucia Morales", "Lucía Morales", 0.647059],
  ["lucía morales", "Lucía Morales", 1],
  ["Morales", "Lucía Morales", 0.571429],
  ["Rosa Quispe", "Lucía Morales", 0],
  ["Andrés Peña-Ruiz", "andres pena ruiz", 0.478261],
  ["Ma. José", "María José Ñahui", 0.388889],
  ["J0sé 42", "José Ramírez", 0.105263],
]

describe("pg_trgm in the browser", () => {
  it.each(GOLDEN)("similarity(%s, %s) matches production", (a, b, expected) => {
    expect(similarity(a, b)).toBeCloseTo(expected, 5)
  })

  it("pads words like pg_trgm and keeps accents", () => {
    expect([...trigrams("Lucía")].sort()).toEqual(["  l", " lu", "cía", "ía ", "luc", "ucí"].sort())
    expect(trigrams("")).toEqual(new Set())
  })

  it("marks only the characters of shared trigrams", () => {
    const name = "Lucía Morales"
    const marked = sharedMask(name, "Lucia Morlaes").map((on, i) => (on ? name[i] : "·")).join("")
    // Compartidos: «  l», « lu», «luc», «  m», « mo», «mor», «es »; el relleno no marca nada.
    expect(marked).toBe("Luc···Mor··es")
  })

  it("filters by threshold or substring and orders by similarity", () => {
    const names = ["Lucía Morales", "Luis Morán", "Rosa Quispe", "Ana Lucía Torres"]
    const typo = search(names, "Lucia Morlaes", 3)
    expect(typo.map((m) => m.name)).toEqual(["Lucía Morales", "Luis Morán", "Ana Lucía Torres"])
    expect(typo.every((m) => m.score >= 0.1)).toBe(true)
    expect(typo[0].score).toBeCloseTo(0.333333, 5)
    // Ambas comparten «ía »; el nombre más corto tiene la unión menor y puntúa más.
    expect(search(names, "ía", 3).map((m) => m.name)).toEqual(["Lucía Morales", "Ana Lucía Torres"])
    expect(search(names, "   ", 3)).toEqual([])
  })
})
