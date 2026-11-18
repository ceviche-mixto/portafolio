"use client"

import * as React from "react"
import { useMotionValueEvent, type MotionValue } from "framer-motion"

/**
 * Convierte un progreso de scroll continuo en un índice de capa discreto.
 *
 * Sólo se actualiza el estado al cruzar un umbral, así que el recorrido completo
 * cuesta cuatro renders en lugar de uno por frame.
 */
export function useScrollLayer(
  progress: MotionValue<number>,
  thresholds: readonly number[]
): number {
  const [layer, setLayer] = React.useState(0)

  useMotionValueEvent(progress, "change", (latest) => {
    let next = 0
    for (let i = 0; i < thresholds.length; i++) {
      if (latest > thresholds[i]) next = i + 1
    }
    // La guarda es el punto: sin ella esto sería el mismo setState por frame.
    setLayer((prev) => (prev === next ? prev : next))
  })

  return layer
}

/** Umbrales de la secuencia de GRADEO, compartidos por el texto y el widget. */
export const GRADEO_LAYER_THRESHOLDS = [0.15, 0.35, 0.6, 0.85] as const
