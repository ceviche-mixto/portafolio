"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { SiteNav } from "./SiteNav"
import { SkipLink } from "./SkipLink"

/**
 * El overlay usa Framer Motion y sólo se ve en modo desarrollador, así que se
 * carga aparte: quien nunca activa ese modo no descarga nada de esto (ver P-01).
 */
const DeveloperOverlay = dynamic(
  () => import("@/features/developer-mode/DeveloperOverlay").then((m) => m.DeveloperOverlay),
  { ssr: false }
)

/**
 * Todo lo que flota por encima de la página, en un solo sitio.
 *
 * Antes había tres elementos fijos independientes (idioma arriba a la izquierda,
 * modo arriba a la derecha, overlay) y ninguna navegación. Ahora la barra reúne
 * anclas y controles, que es lo que resuelve U-06.
 */
export function SiteChrome() {
  return (
    <>
      <SkipLink />
      <SiteNav />
      <DeveloperOverlay />
    </>
  )
}
