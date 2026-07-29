"use client"

import * as React from "react"
import { useTranslation } from "@/hooks/useTranslation"
import { interpolate } from "@/lib/interpolate"
import type { GradeoStats } from "@/lib/gradeo-stats"

/**
 * Rellena los marcadores de la copia de GRADEO con los recuentos reales.
 *
 * Devuelve una función porque los tres textos que llevan cifra viven en sitios
 * distintos (hero de la sección, bento y case study) y todos necesitan el mismo
 * valor.
 */
export function useGradeoCopy(stats: GradeoStats) {
  const { t, lang } = useTranslation()

  const professors = React.useMemo(() => {
    if (stats.professors === null) return t.gradeo.professorsFallback
    return stats.professors.toLocaleString(lang === "es" ? "es-PE" : "en-US")
  }, [stats.professors, t.gradeo.professorsFallback, lang])

  return React.useCallback(
    (template: string) => interpolate(template, { professors }),
    [professors]
  )
}
