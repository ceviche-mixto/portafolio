import { animate, scroll } from "framer-motion"
import { useMotionStore } from "@/store/useMotionStore"

/** Pares `[objetivo, contenedor]` que Motion traduce a rangos de un `ViewTimeline` nativo. */
export const ENTER: [[number, number], [number, number]] = [[0, 1], [1, 1]] // ≡ ["start end", "end end"]
export const EXIT: [[number, number], [number, number]] = [[0, 0], [1, 0]] // ≡ ["start start", "end start"]

type Keyframes = { opacity?: number[]; transform?: string[] }

/**
 * Liga una animación de `opacity`/`transform` al paso de `target` por la
 * pantalla. Con un rango preset y soporte de `ViewTimeline`, el navegador la
 * interpola en el compositor: no hay JavaScript por frame ni estilos inline.
 * Devuelve la limpieza, que cancela la animación. Motion puede dejar el último
 * valor inline un frame después, así que quien la usa remonta el elemento
 * (`key`) al pasar a movimiento reducido.
 *
 * Comprueba la preferencia en el momento: el hook de movimiento reducido
 * empieza en `false` para hidratar igual que el servidor, y sin esta guarda
 * el primer efecto enlazaría un instante antes de saberla.
 */
export function linkToScroll(
  element: HTMLElement,
  target: HTMLElement,
  offset: typeof ENTER,
  keyframes: Keyframes,
  times?: number[]
): () => void {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches || useMotionStore.getState().paused
  if (reduced) return () => {}
  const animation = animate(element, keyframes, { duration: 1, ease: "linear", times })
  const detach = scroll(animation, { target, offset })
  return () => {
    detach()
    animation.cancel()
  }
}
