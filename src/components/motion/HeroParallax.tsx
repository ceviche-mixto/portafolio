"use client"

import * as React from "react"
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion"
import { EXIT, linkToScroll } from "./scroll-linked"

/**
 * Salida del hero ligada al scroll: mientras la figura sale de pantalla
 * (`start start` → `end start`), la captura sube de 0 a −24 px y la línea
 * cobalto se desvanece. Sólo `transform` y `opacity`, en el compositor.
 *
 * La entrada de la guía (240 ms, `scaleX` .92 → 1) es CSS (`.hero-guide`):
 * ocurre en la primera pintura, antes de hidratar, y la media query de
 * movimiento reducido la anula sin esperar a JavaScript.
 *
 * Con movimiento reducido no se enlaza nada: composición estática.
 */
export function HeroParallax({ children }: { children: React.ReactNode }) {
  const root = React.useRef<HTMLDivElement>(null)
  const guide = React.useRef<HTMLSpanElement>(null)
  const layer = React.useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()

  React.useEffect(() => {
    if (reduced || !root.current || !guide.current || !layer.current) return
    const stops = [
      linkToScroll(layer.current, root.current, EXIT, { transform: ["translateY(0px)", "translateY(-24px)"] }),
      linkToScroll(guide.current, root.current, EXIT, { opacity: [1, 0] }),
    ]
    return () => stops.forEach((stop) => stop())
  }, [reduced])

  return (
    // Un nodo nuevo al cambiar la preferencia: el estático no hereda estilos de la animación.
    <div key={reduced ? "static" : "linked"} ref={root} className="relative">
      <span ref={guide} aria-hidden="true" className="absolute top-1/2 -right-6 -left-6">
        <span className="hero-guide block h-px bg-highlight" />
      </span>
      <div ref={layer} className="relative">{children}</div>
    </div>
  )
}
