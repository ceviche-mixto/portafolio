"use client"

import * as React from "react"

/**
 * Carrusel guiado por scroll. Toda la mecánica es CSS (globals.css, `.carousel`):
 *
 * - Base (móvil, o sin `animation-timeline`): pista horizontal nativa con
 *   `scroll-snap`; el scroll vertical nunca queda atrapado.
 * - Escritorio con movimiento: contenedor de 240vh con un marco `sticky`; la
 *   pista se traslada en horizontal ligada al scroll vertical (`view-timeline`).
 * - Escritorio con movimiento reducido: rejilla estática, todo a la vista.
 *
 * El único JavaScript sirve al teclado: en el modo `sticky` una tarjeta puede
 * estar fuera del marco, así que al recibir el foco se desplaza la página al
 * punto del recorrido en que esa tarjeta queda a la vista.
 */
export function ScrollCarousel({ label, children }: { label: string; children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const root = ref.current
    if (!root) return
    const focus = (event: FocusEvent) => {
      const track = root.querySelector<HTMLElement>(".carousel-track")
      const frame = track?.parentElement
      const item = (event.target as Element).closest<HTMLElement>(".carousel-track > li")
      if (!track || !frame || !item || getComputedStyle(track).animationName === "none") return
      const travel = track.offsetWidth - frame.clientWidth
      const progress = Math.min(1, Math.max(0, (item.offsetLeft + item.offsetWidth / 2 - frame.clientWidth / 2) / travel))
      const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-height")) || 0
      const start = root.getBoundingClientRect().top + window.scrollY - header
      window.scrollTo({ top: start + progress * (root.offsetHeight - frame.offsetHeight) })
    }
    root.addEventListener("focusin", focus)
    return () => root.removeEventListener("focusin", focus)
  }, [])

  return (
    <div ref={ref} className="carousel">
      <div className="carousel-frame">
        <ul className="carousel-track" aria-label={label}>
          {children}
        </ul>
        <div className="carousel-progress" aria-hidden="true">
          <span />
        </div>
      </div>
    </div>
  )
}
