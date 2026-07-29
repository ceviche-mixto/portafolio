"use client"

import * as React from "react"
import { useMotionValueEvent, type MotionValue } from "framer-motion"

/**
 * Convierte un progreso de scroll continuo en un índice de capa discreto.
 *
 * El problema que resuelve: antes se guardaba el progreso crudo en estado, así
 * que cada frame de scroll re-renderizaba el árbol completo — decenas de veces
 * por segundo— cuando lo único que se necesitaba era saber en cuál de cinco
 * tramos estábamos. Comparando contra la capa anterior se pasa de ~60 renders por
 * segundo a 4 en todo el recorrido (ver P-03).
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
