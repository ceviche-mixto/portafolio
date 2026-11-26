import type { CSSProperties } from "react"
import type { Language } from "@/lib/language"
import { MOTION_OK } from "./media"

const SKIP = { es: "Saltar", en: "Skip" } as const

/** Borde de la cortina: [x %, radio px, retraso px al caer]. Las de más retraso se estiran en hebras. */
const DRIPS = [
  [3, 44, 24],
  [14, 34, 52],
  [25, 48, 18],
  [36, 28, 92],
  [48, 42, 30],
  [59, 24, 112],
  [70, 46, 20],
  [82, 30, 78],
  [94, 40, 34],
] as const

/** Borde de la cortina dentro de la franja SVG: 120 px por encima y 120 px por debajo. */
const EDGE = 120

/**
 * Decide antes de la primera pintura si la intro se reproduce: una vez por
 * sesión, nunca con movimiento reducido ni si el almacenamiento falla. Sin
 * JS no corre y la capa sigue en `display: none`. Cualquier tecla, un clic o
 * el final de la animación la retiran; la tecla llega antes del cambio de
 * foco, así que Tab cae en el enlace «Saltar al contenido».
 */
const SCRIPT = `(function(){var h=document.documentElement;try{if(sessionStorage.getItem("splash")||!matchMedia(${JSON.stringify(MOTION_OK)}).matches)return;sessionStorage.setItem("splash","1")}catch(e){return}h.dataset.splash="play";var types=["keydown","click","animationend"];function done(e){if(e.type==="animationend"&&!e.target.classList.contains("splash"))return;h.dataset.splash="done";types.forEach(function(t){document.removeEventListener(t,done,true)})}types.forEach(function(t){document.addEventListener(t,done,true)})})()`

/**
 * Intro de marca (~2,35 s): la burbuja de cristal con el logo entra rodando
 * desde abajo, da una vuelta completa en el centro, sale por arriba con
 * impulso y la capa de tinta cae como slime revelando la página. El cierre lo
 * marca el final de la animación de la capa (2400 ms), no un temporizador.
 *
 * Sin estado ni hidratación: un script en línea marca `data-splash` en <html>
 * y la coreografía es CSS (globals.css, `.splash`), así que arranca en la
 * primera pintura aunque el JS de React aún no haya llegado. La página
 * completa está en el HTML debajo de la capa desde el primer byte: no se
 * oculta a buscadores ni retrasa el LCP. El borde viscoso es un filtro gooey
 * (`feGaussianBlur` + `feColorMatrix`) limitado a una franja de 240 px; el
 * resto sólo anima `transform` y `opacity`.
 */
export function SplashLoader({ lang }: { lang: Language }) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />
      <div className="splash">
        <div className="splash-sheet">
          <svg className="splash-goo" aria-hidden="true" focusable="false">
            <filter id="splash-goo" x="-10%" y="-50%" width="120%" height="200%" colorInterpolationFilters="sRGB">
              <feGaussianBlur stdDeviation="12" />
              <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -11" />
            </filter>
            <g filter="url(#splash-goo)">
              <rect x="0" y={EDGE} width="100%" height={EDGE} />
              {DRIPS.map(([x, r, lag]) => (
                <circle key={x} cx={`${x}%`} cy={EDGE} r={r} style={{ "--lag": `${lag}px` } as CSSProperties} />
              ))}
            </g>
          </svg>
          <button type="button" className="splash-skip">
            {SKIP[lang]}
          </button>
        </div>
        <div className="splash-rise" aria-hidden="true">
          <div className="splash-bubble">
            {/* Decorativo y de tamaño fijo: un <img> simple lo encuentra el preescáner sin pasar por el optimizador. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="splash-logo" src="/images/brand/logo-ceviche.webp" width={160} height={160} alt="" decoding="async" />
          </div>
        </div>
      </div>
    </>
  )
}
