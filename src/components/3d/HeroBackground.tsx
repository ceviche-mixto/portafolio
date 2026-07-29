"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion"

/**
 * three.js sólo entra en un chunk aparte que se pide cuando de verdad se va a
 * usar. `ssr: false` porque WebGL no existe en el servidor.
 */
const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false })

/**
 * ¿Merece la pena montar la escena 3D en este dispositivo?
 *
 * Se descarta cuando el visitante pide movimiento reducido, cuando el navegador
 * dice que ahorra datos, o cuando la pantalla es pequeña — que suele significar
 * batería y GPU modestas para un fondo al 50 % de opacidad.
 */
function useShouldRender3D(): boolean {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [capable, setCapable] = React.useState(false)

  React.useEffect(() => {
    const wide = window.matchMedia("(min-width: 768px)")
    const saveData =
      (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
        ?.saveData === true

    const update = () => setCapable(wide.matches && !saveData)
    update()
    wide.addEventListener("change", update)
    return () => wide.removeEventListener("change", update)
  }, [])

  return capable && !prefersReducedMotion
}

/**
 * Fondo del hero: degradado siempre, escena 3D sólo cuando aporta.
 *
 * El degradado no es un placeholder que desaparece — se queda debajo, así que si
 * el canvas nunca se monta el hero sigue viéndose intencional en lugar de vacío.
 *
 * El `IntersectionObserver` desmonta la escena al salir del viewport, que es lo
 * que evita que `useFrame` siga corriendo a 60 fps mientras se lee el resto de la
 * página (ver P-01).
 */
export function HeroBackground() {
  const shouldRender3D = useShouldRender3D()
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    const el = containerRef.current
    if (!el || !shouldRender3D) return

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      // Un margen generoso hace que la escena ya esté lista antes de volver a
      // entrar en pantalla, sin dejarla viva durante toda la página.
      { rootMargin: "200px 0px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [shouldRender3D])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 h-screen w-full overflow-hidden"
    >
      {/* Reserva visual: presente siempre, también como fallback definitivo. */}
      <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_35%,rgba(16,185,129,0.14),transparent_70%),radial-gradient(45%_40%_at_75%_20%,rgba(56,189,248,0.10),transparent_70%)]" />
      {/* Sin `mix-blend-screen`: ese modo aclara lo que hay debajo y convertía la
          esfera en un velo claro sobre el titular. */}
      {shouldRender3D && visible && (
        <div className="absolute inset-0 opacity-70">
          <HeroCanvas />
        </div>
      )}
    </div>
  )
}
