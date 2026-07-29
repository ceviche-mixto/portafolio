"use client"

import * as React from "react"

/**
 * `prefers-reduced-motion` sin dependencias.
 *
 * Framer Motion trae `useReducedMotion`, pero importarlo arrastra toda la
 * librería (~100 KB comprimidos) al bundle inicial. Los componentes del primer
 * render sólo necesitan el booleano, y eso es una media query.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false)

  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReduced(query.matches)
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])

  return reduced
}
