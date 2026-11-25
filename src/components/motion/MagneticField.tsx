"use client"

import * as React from "react"
import { FINE_POINTER, matches, MOTION_OK } from "./media"

const PULL = 8 // px máximos del botón; su contenido se desplaza la mitad (globals.css).
const TARGET = ".tactile"

/**
 * Atracción magnética de todos los botones del sitio: cualquier `.tactile`
 * (cada `buttonVariants` y los controles de la cabecera). Una sola isla delega
 * en `document`; sólo con puntero fino y movimiento permitido escucha el
 * puntero, así que en táctil no añade ningún listener.
 *
 * El JS sólo escribe `--mx`/`--my` en el botón bajo el cursor. El CSS los
 * aplica con la propiedad `translate`, que se suma al `transform` de la
 * pulsación táctil (`:active`) sin pisarlo; los hijos siguen a la mitad
 * (paralaje) y al salir todo vuelve con rebote elástico (globals.css).
 */
export function MagneticField() {
  React.useEffect(() => {
    if (!matches(FINE_POINTER) || !matches(MOTION_OK)) return
    let current: HTMLElement | null = null
    let box: DOMRect | null = null

    const release = () => {
      if (!current) return
      delete current.dataset.magnet
      current.style.removeProperty("--mx")
      current.style.removeProperty("--my")
      current = null
    }
    const over = (event: PointerEvent) => {
      const target = event.pointerType === "touch" ? null : (event.target as Element).closest<HTMLElement>(TARGET)
      if (target === current) return
      release()
      if (!target) return
      current = target
      box = null
      target.dataset.magnet = ""
    }
    const move = (event: PointerEvent) => {
      if (!current) return
      // Se mide en el primer movimiento, antes de desplazarlo; el scroll invalida la medida.
      box ??= current.getBoundingClientRect()
      const x = Math.max(-0.5, Math.min(0.5, (event.clientX - box.left) / box.width - 0.5))
      const y = Math.max(-0.5, Math.min(0.5, (event.clientY - box.top) / box.height - 0.5))
      current.style.setProperty("--mx", `${(x * 2 * PULL).toFixed(1)}px`)
      current.style.setProperty("--my", `${(y * 2 * PULL).toFixed(1)}px`)
    }
    const out = (event: PointerEvent) => {
      if (current && !current.contains(event.relatedTarget as Node | null)) release()
    }
    const stale = () => {
      box = null
    }

    const options = { passive: true }
    document.addEventListener("pointerover", over, options)
    document.addEventListener("pointermove", move, options)
    document.addEventListener("pointerout", out, options)
    window.addEventListener("scroll", stale, options)
    return () => {
      document.removeEventListener("pointerover", over)
      document.removeEventListener("pointermove", move)
      document.removeEventListener("pointerout", out)
      window.removeEventListener("scroll", stale)
      release()
    }
  }, [])

  return null
}
