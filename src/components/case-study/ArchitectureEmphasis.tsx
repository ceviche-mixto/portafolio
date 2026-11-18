"use client"

import * as React from "react"
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion"
import { ENTER, linkToScroll } from "@/components/motion/scroll-linked"

type Track = { target: React.RefObject<HTMLDivElement | null>; steps: number }
const TrackContext = React.createContext<Track | null>(null)

/**
 * Keyframes de `max(0, 1 − |(n − 1)·p − i|)` para el nodo `i` de `n`. La
 * función es lineal a trozos: evaluada en sus vértices y en los extremos del
 * rango, el navegador la reproduce exacta al interpolar.
 */
export function emphasisKeyframes(index: number, steps: number): { times: number[]; values: number[] } {
  const intensity = (p: number) => Math.max(0, 1 - Math.abs((steps - 1) * p - index))
  const span = 1 / (steps - 1)
  const times = [...new Set([0, (index - 1) * span, index * span, (index + 1) * span, 1])]
    .filter((t) => t >= 0 && t <= 1)
    .sort((a, b) => a - b)
  return { times, values: times.map(intensity) }
}

/**
 * Progreso de scroll compartido por los nodos de un diagrama: la sección que
 * lo contiene, mientras entra en pantalla. Los pasos son HTML del servidor y
 * están siempre montados; sólo cambian las capas de realce, así que volver
 * hacia arriba o saltar a un ancla lleva directo al estado que corresponde.
 */
export function EmphasisTrack({ steps, children }: { steps: number; children: React.ReactNode }) {
  const target = React.useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const track = React.useMemo(() => ({ target, steps }), [steps])
  return (
    <div ref={target}>
      <TrackContext.Provider value={reduced ? null : track}>{children}</TrackContext.Provider>
    </div>
  )
}

/**
 * Capa de realce de un nodo: sólo opacidad y escala, nada que cambie el layout.
 * Con movimiento reducido no se monta.
 */
export function EmphasisLayer({ index }: { index: number }) {
  const track = React.useContext(TrackContext)
  const ref = React.useRef<HTMLSpanElement>(null)

  React.useEffect(() => {
    const target = track?.target.current
    if (!track || !target || !ref.current) return
    const { times, values } = emphasisKeyframes(index, track.steps)
    return linkToScroll(
      ref.current,
      target,
      ENTER,
      { opacity: values, transform: values.map((v) => `scale(${1 + 0.35 * v})`) },
      times
    )
  }, [track, index])

  if (!track) return null
  return (
    <span
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 hidden rounded-full bg-highlight/15 opacity-0 ring-2 ring-highlight md:block"
    />
  )
}
