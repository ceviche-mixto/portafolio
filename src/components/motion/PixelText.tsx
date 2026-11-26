import type { CSSProperties } from "react"

/**
 * Titular que se decodifica como una terminal retro-futurista: cada letra
 * espera como un bloque `░`, cambia por pasos discretos entre `▓ # 0 1` y se
 * fija con un destello cromático cian/magenta de 180 ms (globals.css, `.px-char`).
 *
 * Sin JavaScript: es un Server Component y toda la coreografía es CSS con
 * `steps`, así que arranca en la primera pintura. La letra real ocupa su
 * sitio desde el HTML (CLS 0) y el glifo es un pseudo-elemento encima. El
 * lector de pantalla lee la frase de corrido en el `sr-only`; la copia visual
 * va con `aria-hidden`. Con movimiento reducido el texto llega fijo. Al
 * terminar (480 ms por letra) no queda capa ni sombra: las animaciones
 * rellenan sólo hacia atrás y el estilo base es la letra limpia.
 */
export function PixelText({ text }: { text: string }) {
  const words = text.split(" ").map((word) => [...word])
  // Índice global del primer carácter de cada palabra: el escalonado sigue la frase entera.
  const starts = words.map((_, w) => words.slice(0, w).reduce((sum, chars) => sum + chars.length, 0))
  return (
    <span className="px-text">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((chars, w) => (
          <span key={w}>
            {w > 0 && " "}
            <span className="px-word">
              {chars.map((char, c) => (
                <span key={c} className="px-char" style={{ "--i": starts[w] + c } as CSSProperties}>
                  {char}
                </span>
              ))}
            </span>
          </span>
        ))}
      </span>
    </span>
  )
}
