"use client"

import * as React from "react"
import { matches, MOTION_OK } from "./media"

/**
 * Titular dividido en palabras y caracteres que suben desde una máscara.
 *
 * El lector de pantalla lee la frase de corrido en el `sr-only`; la copia
 * visual va con `aria-hidden` (WCAG 2.5.3 y 1.3.1). Cada carácter lleva su
 * índice en `--i` y el CSS escalona el retardo (globals.css, `.split-char`).
 *
 * - `load`: se anima al pintar, sin JavaScript. Para lo que está arriba del pliegue.
 * - `view`: el HTML llega visible; si al montar está bajo el pliegue se arma
 *   (caracteres ocultos) y se reproduce una sola vez al entrar en pantalla.
 *   Si ya está a la vista, se queda quieto: nada desaparece delante del lector.
 */
export function SplitText({ text, trigger = "view" }: { text: string; trigger?: "load" | "view" }) {
  const ref = React.useRef<HTMLSpanElement>(null)

  React.useEffect(() => {
    const el = ref.current
    if (trigger !== "view" || !el || !matches(MOTION_OK) || typeof IntersectionObserver === "undefined") return
    if (el.getBoundingClientRect().top < window.innerHeight) return
    el.dataset.split = "armed"
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        el.dataset.split = "play"
        observer.disconnect()
      },
      { rootMargin: "0px 0px -15% 0px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [trigger])

  const words = text.split(" ").map((word) => [...word])
  // Índice global del primer carácter de cada palabra: el escalonado sigue la frase entera.
  const starts = words.map((_, w) => words.slice(0, w).reduce((sum, chars) => sum + chars.length, 0))
  return (
    <span ref={ref} className={trigger === "load" ? "split split-load" : "split"}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((chars, w) => (
          <React.Fragment key={w}>
            {w > 0 && " "}
            <span className="split-word">
              {chars.map((char, c) => (
                <span key={c} className="split-char" style={{ "--i": starts[w] + c } as React.CSSProperties}>
                  {char}
                </span>
              ))}
            </span>
          </React.Fragment>
        ))}
      </span>
    </span>
  )
}
