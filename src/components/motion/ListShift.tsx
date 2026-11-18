"use client"

import * as React from "react"
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion"
import { ENTER, linkToScroll } from "./scroll-linked"

/**
 * Desplazamiento de una imagen del listado mientras entra en pantalla: de
 * 12 px a 0 ligado al scroll. Las tarjetas de una fila empiezan a la misma
 * altura, así que avanzan juntas. Título, texto y enlace no se mueven.
 *
 * Esta capa sólo traslada; el zoom de hover vive en la imagen interior
 * (`.card-media`), así que los dos transforms no compiten.
 */
export function ListShift({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()

  React.useEffect(() => {
    if (reduced || !ref.current) return
    // El progreso se mide en el contenedor, que no se mueve; la capa trasladada no sirve de referencia.
    const target = ref.current.parentElement ?? ref.current
    return linkToScroll(ref.current, target, ENTER, { transform: ["translateY(12px)", "translateY(0px)"] })
  }, [reduced])

  // Un nodo nuevo al cambiar la preferencia: el estático no hereda estilos de la animación.
  return <div key={reduced ? "static" : "linked"} ref={ref} className={className}>{children}</div>
}
