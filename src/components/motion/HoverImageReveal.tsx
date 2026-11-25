"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import { FINE_POINTER, matches, MOTION_OK } from "./media"

const QUERY = `${FINE_POINTER} and ${MOTION_OK}`
const W = 280
const H = 180
const GAP = 24

function subscribe(onChange: () => void) {
  const list = window.matchMedia?.(QUERY)
  list?.addEventListener("change", onChange)
  return () => list?.removeEventListener("change", onChange)
}

/**
 * Vista previa flotante (280×180) que sigue al puntero sobre una tarjeta.
 *
 * Sólo existe con puntero fino y movimiento permitido: en táctil no se monta
 * ni el portal ni un listener. La posición se interpola (lerp) en un bucle de
 * `requestAnimationFrame` que se detiene en cuanto llega; la inclinación es
 * proporcional a la velocidad horizontal. El revelado (escala y opacidad,
 * 180 ms) es CSS (`.hover-reveal`). Es decorativa: la tarjeta ya enlaza al caso.
 */
export function HoverImageReveal({
  image,
  className,
  children,
}: {
  image: { src: string; width: number; height: number }
  className?: string
  children: React.ReactNode
}) {
  const enabled = React.useSyncExternalStore(subscribe, () => matches(QUERY), () => false)
  const ref = React.useRef<HTMLDivElement>(null)
  const preview = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const el = ref.current
    const card = preview.current
    if (!enabled || !el || !card) return
    let x = 0, y = 0, tx = 0, ty = 0, tilt = 0, frame = 0

    const target = (event: PointerEvent) => {
      // A la derecha del cursor; si no cabe, a la izquierda. Nunca fuera de la ventana.
      const right = event.clientX + GAP + W <= window.innerWidth
      tx = right ? event.clientX + GAP : event.clientX - GAP - W
      ty = Math.min(Math.max(event.clientY - H / 2, 8), window.innerHeight - H - 8)
    }
    const tick = () => {
      const nx = x + (tx - x) * 0.2
      tilt += (Math.max(-8, Math.min(8, (nx - x) * 0.5)) - tilt) * 0.2
      x = nx
      y += (ty - y) * 0.2
      card.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${tilt.toFixed(2)}deg)`
      // Quieto el puntero y llegada la tarjeta, el bucle se apaga; el siguiente movimiento lo reanuda.
      const settled = Math.abs(tx - x) < 0.5 && Math.abs(ty - y) < 0.5 && Math.abs(tilt) < 0.05
      frame = settled ? 0 : requestAnimationFrame(tick)
    }
    const move = (event: PointerEvent) => {
      target(event)
      if (!frame) frame = requestAnimationFrame(tick)
    }
    const enter = (event: PointerEvent) => {
      target(event)
      x = tx
      y = ty
      card.dataset.visible = ""
      move(event)
    }
    const leave = () => {
      delete card.dataset.visible
    }
    el.addEventListener("pointerenter", enter)
    el.addEventListener("pointermove", move)
    el.addEventListener("pointerleave", leave)
    return () => {
      cancelAnimationFrame(frame)
      el.removeEventListener("pointerenter", enter)
      el.removeEventListener("pointermove", move)
      el.removeEventListener("pointerleave", leave)
    }
  }, [enabled])

  return (
    <div ref={ref} className={className}>
      {children}
      {enabled &&
        createPortal(
          <div ref={preview} aria-hidden="true" className="hover-reveal">
            <div className="hover-reveal-card">
              <Image src={image.src} width={image.width} height={image.height} alt="" sizes={`${W}px`} className="h-full w-full object-cover object-top" />
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}
