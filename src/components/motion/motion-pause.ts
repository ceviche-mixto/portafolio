import * as React from "react"

/**
 * Pausa compartida de todo lo que se mueve solo más de 5 s (WCAG 2.2.2): el
 * fondo global y la pista del logo. Un solo botón (`MotionPauseToggle`, en la cabecera) la
 * alterna y cada isla se suscribe; no hace falta una librería de estado.
 */
let paused = false
const listeners = new Set<() => void>()

export function setMotionPaused(value: boolean) {
  paused = value
  listeners.forEach((listener) => listener())
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function useMotionPaused(): boolean {
  return React.useSyncExternalStore(subscribe, () => paused, () => false)
}
