"use client"

import * as React from "react"
import { FINE_POINTER, matches, MOTION_OK } from "./media"

const PULL = 10 // px máximos del contenedor; el texto interior se mueve la mitad.

/**
 * Envoltorio magnético para un CTA. Sólo con puntero fino y movimiento
 * permitido escucha el puntero; en táctil no añade ningún listener.
 *
 * El JS sólo escribe `--mx`/`--my`; el CSS desplaza el envoltorio y, a la
 * mitad, el `[data-magnetic-text]` de dentro (paralaje), y al salir vuelve
 * con rebote elástico (globals.css, `.magnetic`). El desplazamiento va en el
 * envoltorio y la pulsación en el botón: las dos transformaciones se suman.
 */
export function MagneticButton({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLSpanElement>(null)

  React.useEffect(() => {
    const el = ref.current
    if (!el || !matches(FINE_POINTER) || !matches(MOTION_OK)) return
    let box = el.getBoundingClientRect()
    const enter = () => {
      box = el.getBoundingClientRect()
      el.dataset.active = ""
    }
    const move = (event: PointerEvent) => {
      const x = (event.clientX - box.left) / box.width - 0.5
      const y = (event.clientY - box.top) / box.height - 0.5
      el.style.setProperty("--mx", `${(x * 2 * PULL).toFixed(1)}px`)
      el.style.setProperty("--my", `${(y * 2 * PULL).toFixed(1)}px`)
    }
    const leave = () => {
      delete el.dataset.active
      el.style.removeProperty("--mx")
      el.style.removeProperty("--my")
    }
    el.addEventListener("pointerenter", enter)
    el.addEventListener("pointermove", move)
    el.addEventListener("pointerleave", leave)
    return () => {
      el.removeEventListener("pointerenter", enter)
      el.removeEventListener("pointermove", move)
      el.removeEventListener("pointerleave", leave)
    }
  }, [])

  return (
    <span ref={ref} className="magnetic">
      {children}
    </span>
  )
}
