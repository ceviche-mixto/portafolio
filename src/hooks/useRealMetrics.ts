"use client"

import * as React from "react"

type PerformanceWithMemory = Performance & {
  memory?: { usedJSHeapSize: number; jsHeapSizeLimit: number }
}

export type RealMetrics = {
  /** Cuadros por segundo medidos en el último segundo. `null` hasta la primera muestra. */
  fps: number | null
  /** Milisegundos por cuadro. `null` hasta la primera muestra. */
  frameMs: number | null
  /** Heap de JS en MB, o `null` si el navegador no lo expone (sólo Chromium). */
  heapMb: number | null
}

/**
 * Mide rendimiento de verdad.
 *
 * Sustituye al HUD anterior, que generaba FPS, memoria y tiempo de render con
 * `Math.random()` y los presentaba como monitoreo — algo que ESLint marcaba como
 * error de pureza y que, en un panel dirigido a revisores técnicos, es un riesgo
 * de credibilidad (ver C-02).
 *
 * `performance.memory` no es estándar y sólo existe en Chromium: cuando falta se
 * devuelve `null` y la interfaz muestra «n/d» en lugar de inventar un número.
 */
export function useRealMetrics(enabled: boolean): RealMetrics {
  const [metrics, setMetrics] = React.useState<RealMetrics>({
    fps: null,
    frameMs: null,
    heapMb: null,
  })

  React.useEffect(() => {
    if (!enabled) return

    let raf = 0
    let frames = 0
    let windowStart = performance.now()

    const tick = (now: number) => {
      frames++
      const elapsed = now - windowStart

      // Se acumula un segundo entero antes de publicar: una media por segundo es
      // estable, mientras que medir cuadro a cuadro sólo produce ruido.
      if (elapsed >= 1000) {
        const fps = Math.round((frames * 1000) / elapsed)
        const perf = performance as PerformanceWithMemory
        const heap = perf.memory?.usedJSHeapSize

        setMetrics({
          fps,
          frameMs: Math.round((elapsed / frames) * 10) / 10,
          heapMb: heap ? Math.round(heap / 1024 / 1024) : null,
        })

        frames = 0
        windowStart = now
      }

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [enabled])

  return metrics
}
