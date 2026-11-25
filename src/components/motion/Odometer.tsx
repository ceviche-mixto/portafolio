"use client"

import * as React from "react"
import { canAnimate } from "./media"

const REEL = "0\n1\n2\n3\n4\n5\n6\n7\n8\n9"

/**
 * Número con un carril vertical 0–9 por dígito. El HTML llega con el valor
 * final (cada carril ya desplazado `--d` posiciones), así que sin JavaScript o
 * con movimiento reducido se lee igual. Con movimiento, WAAPI deja cada carril
 * en 0 y lo hace rodar hasta su dígito la primera vez que entra en pantalla.
 *
 * Cifras tabulares y carriles de una línea de alto: el ancho y el alto no
 * cambian en ningún momento (CLS 0). El valor se anuncia en el `sr-only`.
 */
export function Odometer({ value, locale }: { value: number; locale: string }) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const text = value.toLocaleString(locale)

  React.useEffect(() => {
    const el = ref.current
    if (!el || !canAnimate() || typeof IntersectionObserver === "undefined") return
    const reels = [...el.querySelectorAll<HTMLElement>(".odometer-reel")]
    // `backwards` mantiene el 0 durante el retardo; al terminar manda el estilo en línea (valor final).
    const animations = reels.map((reel, i) =>
      reel.animate(
        [{ transform: "translate3d(0, 0, 0)" }, { transform: `translate3d(0, ${Number(reel.dataset.d) * -10}%, 0)` }],
        { duration: 1100, delay: i * 90, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "backwards" }
      )
    )
    animations.forEach((animation) => animation.pause())
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        animations.forEach((animation) => animation.play())
        observer.disconnect()
      },
      { threshold: 0.6 }
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      animations.forEach((animation) => animation.cancel())
    }
  }, [text])

  return (
    <span ref={ref} className="odometer">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {[...text].map((char, i) =>
          /\d/.test(char) ? (
            <span key={i} className="odometer-digit">
              <span className="odometer-reel" data-d={char} style={{ "--d": char } as React.CSSProperties}>
                {REEL}
              </span>
            </span>
          ) : (
            <span key={i}>{char}</span>
          )
        )}
      </span>
    </span>
  )
}
