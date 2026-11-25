import { canAnimate } from "./media"

/**
 * Feedback celebratorio con WAAPI, sin dependencias ni estado de React.
 *
 * La pulsación física (compresión al `:active`, rebote al soltar) es CSS:
 * `.tactile` en globals.css, aplicada a todas las variantes de botón.
 *
 * `celebrate` lanza 9 partículas cobalto y terracota desde el centro del
 * elemento y un check con rebote sobre su esquina. Todo va en una capa `fixed`
 * fuera del flujo, `aria-hidden` y sin eventos de puntero: no desplaza nada
 * (CLS 0) y se retira sola al terminar. Con movimiento reducido no hace nada;
 * la confirmación textual de cada componente sigue ahí.
 */
const COLORS = ["#253BD6", "#ECA888"]
const SHAPES = ["border-radius:50%", "border-radius:2px", "clip-path:polygon(50% 0,100% 100%,0 100%)"]
const PARTICLES = 9
const CHECK =
  '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>'

export function celebrate(anchor: Element | null) {
  if (!anchor || !canAnimate()) return
  const box = anchor.getBoundingClientRect()
  const layer = document.createElement("div")
  layer.setAttribute("aria-hidden", "true")
  layer.style.cssText = `position:fixed;left:${box.left + box.width / 2}px;top:${box.top + box.height / 2}px;width:0;height:0;pointer-events:none;z-index:60`

  const badge = document.createElement("span")
  badge.innerHTML = CHECK
  // Encima de la esquina superior derecha: nunca tapa el valor que celebra.
  badge.style.cssText = `position:absolute;left:${box.width / 2 - 4}px;top:${-box.height / 2 - 30}px;display:grid;place-items:center;width:28px;height:28px;border-radius:50%;background:${COLORS[0]};box-shadow:0 0 0 3px #f5f0e8`

  const particles = Array.from({ length: PARTICLES }, (_, i) => {
    const particle = document.createElement("span")
    particle.style.cssText = `position:absolute;left:-4px;top:-4px;width:8px;height:8px;background:${COLORS[i % 2]};${SHAPES[i % 3]}`
    return particle
  })
  layer.append(...particles, badge)
  document.body.append(layer)

  const animations = particles.map((particle, i) => {
    const angle = (i / PARTICLES) * Math.PI * 2 + Math.random() * 0.5
    const distance = 34 + Math.random() * 26
    const x = Math.cos(angle) * distance
    const y = Math.sin(angle) * distance
    return particle.animate(
      [
        { transform: "translate3d(0, 0, 0) scale(0.4) rotate(0deg)", opacity: 1 },
        { transform: `translate3d(${x}px, ${y}px, 0) scale(1) rotate(${180 + Math.random() * 180}deg)`, opacity: 1, offset: 0.7 },
        { transform: `translate3d(${x * 1.15}px, ${y * 1.15 + 10}px, 0) scale(0.8) rotate(360deg)`, opacity: 0 },
      ],
      { duration: 620, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" }
    )
  })
  animations.push(
    badge.animate(
      [
        { transform: "scale(0)", opacity: 0 },
        { transform: "scale(1.2)", opacity: 1, offset: 0.3 },
        { transform: "scale(1)", opacity: 1, offset: 0.45 },
        { transform: "scale(1)", opacity: 1, offset: 0.8 },
        { transform: "scale(0.6) translateY(-6px)", opacity: 0 },
      ],
      { duration: 1100, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)", fill: "forwards" }
    )
  )
  // `finished` se rechaza si alguien cancela la animación: se retira igual, sin rechazo sin capturar.
  const remove = () => layer.remove()
  Promise.all(animations.map((animation) => animation.finished)).then(remove, remove)
}

/** Pulso elástico de acierto sobre un valor (p. ej. el puntaje de la demo). */
export function pulse(el: Element | null) {
  if (!el || !canAnimate()) return
  el.animate(
    [{ transform: "scale(1)" }, { transform: "scale(1.35)", offset: 0.35 }, { transform: "scale(1)" }],
    { duration: 520, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" }
  )
}
