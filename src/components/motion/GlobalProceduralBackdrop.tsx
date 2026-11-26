"use client"

import * as React from "react"
import { FINE_POINTER, matches, MOTION_OK } from "./media"
import { useMotionPaused } from "./motion-pause"

/* ── Parámetros ajustables ─────────────────────────────────────────────────── */

/** Velocidades. Paquetes y deriva en px/s; ondas y piloto automático en rad/s. */
const SPEED = {
  packet: [80, 170] as const, // px/s de cada paquete de datos (mín., máx.)
  wave: 0.35, // rad/s: ondulación de los rieles
  drift: 9, // px/s: deriva máxima de las partículas
  follow: 0.08, // lerp: fracción del camino hacia el cursor en cada fotograma a 60 fps
  autopilot: 0.22, // rad/s: parallax autónomo cuando no hay ratón (táctil)
}

/** Paleta: tinta, cobalto, cian, terracota y magenta. */
const COLORS = { ink: "#15171C", cobalt: "#253BD6", cyan: "#00F0FF", terracotta: "#ECA888", magenta: "#FF2A85" }
const PACKET_COLORS = [COLORS.cobalt, COLORS.cobalt, COLORS.cyan, COLORS.magenta, COLORS.terracotta]
const NODE_COLORS = [COLORS.cobalt, COLORS.cyan, COLORS.magenta, COLORS.cobalt, COLORS.terracotta]

/** Densidad según el viewport; con más dpr, menos elementos (tope 1,5x: el lienzo ocupa toda la pantalla). */
const DENSITY = {
  packetEvery: 120, // un paquete por cada N px de ancho
  packets: [6, 16] as const,
  particleEvery: 14000, // una partícula por cada N px² de pantalla
  particles: [24, 72] as const,
  nodeEvery: 52000, // un nodo por cada N px² de pantalla
  nodes: [10, 26] as const,
  maxDpr: 1.5,
}

const PARALLAX = 18 // px que se desplaza la capa más cercana con el cursor
/** Fracción del scroll que recorre cada capa: cuanto más cerca, más rápido. */
const SCROLL = { grid: 0.12, rails: 0.22, nodes: 0.32 }
const GRID = 160 // px: periodo de la retícula mayor (globals.css, `.gb-grid`)
const MARGIN = 80 // px fuera de pantalla donde las capas dan la vuelta sin que se vea
const TRAIL = 14 // tramos de cada estela
const TAU = Math.PI * 2

/* ── Horizonte arquitectónico (SVG, viewBox 1440 × 300, horizonte en y = 236) ─ */

const HORIZON = 236
/** Perfil: [x inicial, x final, altura sobre el horizonte]. */
const BLOCKS = [
  [24, 64, 92], [64, 150, 30], [190, 300, 18], [300, 340, 44], [380, 520, 14], [560, 610, 58], [610, 700, 26],
  [700, 730, 96], [730, 800, 40], [840, 960, 22], [960, 1010, 120], [1010, 1080, 64], [1120, 1230, 34],
  [1230, 1262, 148], [1262, 1330, 52], [1370, 1420, 24],
] as const
const SKYLINE = `M0 ${HORIZON}${BLOCKS.map(([a, b, h]) => `H${a}V${HORIZON - h}H${b}V${HORIZON}`).join("")}H1440`
/** Forjados de las torres: una línea cada 16 px. */
const FLOORS = BLOCKS.filter(([, , h]) => h > 50)
  .flatMap(([a, b, h]) => Array.from({ length: Math.floor(h / 16) }, (_, i) => `M${a + 6} ${HORIZON - 16 * (i + 1)}H${b - 6}`))
  .join("")
/** Líneas de construcción discontinuas sobre las torres más altas. */
const CONSTRUCTION = BLOCKS.filter(([, , h]) => h > 90)
  .map(([a, b, h]) => `M${(a + b) / 2} ${HORIZON - h}V${HORIZON - h - 44}`)
  .join("")
/** Suelo en perspectiva: fuga en (720, 120), sólo bajo el horizonte, y paralelas cada vez más separadas. */
const GROUND = [
  ...Array.from({ length: 21 }, (_, i) => {
    const bottom = -480 + i * 120
    return `M${720 + (bottom - 720) * ((HORIZON - 120) / 180)} ${HORIZON}L${bottom} 300`
  }),
  ...Array.from({ length: 5 }, (_, i) => `M0 ${(HORIZON + 64 * ((i + 1) / 5) ** 1.6).toFixed(1)}H1440`),
].join("")

/* ── Canvas: rieles, carriles, nodos y partículas ──────────────────────────── */

type Point = [number, number]
/** Viewport, desplazamiento de scroll ya aplicado y margen lateral del contenido. */
type Geo = { w: number; h: number; scroll: number; gutter: number }
/** Envuelve `y` en [−MARGIN, h + MARGIN): las capas dan la vuelta fuera de pantalla. */
const wrap = (y: number, h: number) => ((((y + MARGIN) % (h + 2 * MARGIN)) + h + 2 * MARGIN) % (h + 2 * MARGIN)) - MARGIN
/** Cuatro rieles horizontales que suben con el scroll y dos carriles verticales en los márgenes. */
const RAILS = [0.16, 0.4, 0.64, 0.88]
const route = (index: number, u: number, t: number, g: Geo): Point => {
  if (index < RAILS.length) {
    const base = wrap(RAILS[index] * g.h - g.scroll * SCROLL.rails, g.h)
    const x = index % 2 ? (1 - u) * g.w : u * g.w
    return [x, base + 0.035 * g.h * Math.sin(u * (5 + index * 2) + index * 1.7 + t * SPEED.wave * (index % 2 ? -1 : 1))]
  }
  const x = index === RAILS.length ? g.gutter : g.w - g.gutter
  return [x + 4 * Math.sin(u * 6 + index + t * SPEED.wave), g.h + MARGIN - (g.h + 2 * MARGIN) * u]
}
const ROUTES = RAILS.length + 2

type Packet = { route: number; u: number; speed: number; tail: number; width: number; color: string }
type Beacon = { x: number; y: number; z: number; color: string; phase: number; period: number; trace: Point }
type Particle = { x: number; y: number; z: number; r: number; vx: number; vy: number; phase: number; alpha: number; color: string }

const rand = (min: number, max: number) => min + Math.random() * (max - min)
const pick = <T,>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)]

/**
 * Fondo de toda la portada generado por código, fijo detrás del contenido
 * (`fixed inset-0 -z-10`): retícula de plano que sube con el scroll (CSS),
 * horizonte arquitectónico (SVG), y en canvas rieles con paquetes de datos,
 * nodos que laten con su traza de circuito y partículas con profundidad.
 *
 * - Parallax doble: el cursor (escritorio, con lerp) y el scroll, que mueve
 *   cada capa a su propia velocidad; en táctil, piloto automático sin listeners.
 * - Velo: una máscara baja la intensidad en la columna central, donde va el
 *   texto, y la deja plena en los márgenes (globals.css, `.gb`).
 * - Un solo bucle `requestAnimationFrame`, parado con la pestaña oculta o
 *   tras la pausa compartida (`motion-pause`, botón en la cabecera).
 * - Movimiento reducido: un único fotograma estático, sin bucle.
 *
 * Todo es `aria-hidden` y `pointer-events: none`; nada ocupa sitio en el flujo (CLS 0).
 */
export function GlobalProceduralBackdrop() {
  const root = React.useRef<HTMLDivElement>(null)
  const grid = React.useRef<HTMLDivElement>(null)
  const band = React.useRef<SVGSVGElement>(null)
  const paused = useMotionPaused()
  const pausedRef = React.useRef(false)
  const syncRef = React.useRef(() => {})

  React.useEffect(() => {
    pausedRef.current = paused
    syncRef.current()
  }, [paused])

  React.useEffect(() => {
    const el = root.current
    const canvas = el?.querySelector("canvas")
    const ctx = canvas?.getContext("2d")
    if (!el || !canvas || !ctx) return
    const motion = matches(MOTION_OK)
    const autopilot = !matches(FINE_POINTER)
    const geo: Geo = { w: 0, h: 0, scroll: 0, gutter: 0 }
    const target = { x: 0, y: 0 }
    const view = { x: 0, y: 0 }
    let dpr = 1
    let time = 0
    let lengths: number[] = []
    let packets: Packet[] = []
    let nodes: Beacon[] = []
    let particles: Particle[] = []

    const spawn = (scatter: boolean): Packet => ({
      // Siete de cada diez por los rieles; el resto sube por los márgenes.
      route: Math.random() < 0.7 ? Math.floor(Math.random() * RAILS.length) : RAILS.length + Math.floor(Math.random() * 2),
      u: scatter ? Math.random() : 0,
      speed: rand(...SPEED.packet),
      tail: rand(60, 170),
      width: rand(1.3, 2.4),
      color: pick(PACKET_COLORS),
    })
    const particle = (): Particle => {
      const tone = Math.random()
      return {
        x: rand(0, geo.w),
        y: rand(0, geo.h),
        z: rand(0.2, 1),
        r: rand(0.7, 1.9),
        vx: rand(-1, 1) * SPEED.drift,
        vy: -rand(0.2, 1) * SPEED.drift,
        phase: rand(0, TAU),
        alpha: tone < 0.6 ? rand(0.14, 0.24) : rand(0.3, 0.5),
        color: tone < 0.6 ? COLORS.ink : tone < 0.8 ? COLORS.cobalt : tone < 0.9 ? COLORS.cyan : COLORS.magenta,
      }
    }
    const node = (): Beacon => {
      const z = rand(0.5, 1)
      return {
        x: rand(0.03, 0.97),
        y: rand(0, 1),
        z,
        color: pick(NODE_COLORS),
        phase: rand(0, 1),
        period: rand(2.8, 4.6),
        // Traza en L hacia un lado: media cuadrícula en horizontal y otra en vertical.
        trace: [pick([-1, 1]) * rand(24, 64), pick([-1, 1]) * rand(16, 48)],
      }
    }

    const draw = () => {
      const sx = -view.x * PARALLAX
      const sy = -view.y * PARALLAX
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, geo.w, geo.h)
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      // Rieles tenues y paquetes con estela que se afina hacia atrás.
      ctx.translate(sx * 0.6, sy * 0.6)
      ctx.globalAlpha = 0.14
      ctx.strokeStyle = COLORS.cobalt
      ctx.lineWidth = 1
      for (let r = 0; r < ROUTES; r++) {
        ctx.beginPath()
        for (let i = 0; i <= 64; i++) {
          const [x, y] = route(r, i / 64, time, geo)
          if (i) ctx.lineTo(x, y)
          else ctx.moveTo(x, y)
        }
        ctx.stroke()
      }
      for (const p of packets) {
        const step = p.tail / lengths[p.route] / TRAIL
        ctx.strokeStyle = p.color
        ctx.fillStyle = p.color
        let prev: Point | null = null
        for (let k = 0; k <= TRAIL; k++) {
          const u = p.u - k * step
          if (u < 0 || u > 1) {
            prev = null
            continue
          }
          const point = route(p.route, u, time, geo)
          if (prev) {
            const fade = 1 - k / TRAIL
            ctx.globalAlpha = 0.85 * fade * fade
            ctx.lineWidth = p.width * (0.4 + 0.6 * fade)
            ctx.beginPath()
            ctx.moveTo(prev[0], prev[1])
            ctx.lineTo(point[0], point[1])
            ctx.stroke()
          }
          prev = point
        }
        if (p.u >= 0 && p.u <= 1) {
          const [x, y] = route(p.route, p.u, time, geo)
          ctx.globalAlpha = 0.2
          ctx.beginPath()
          ctx.arc(x, y, p.width * 3.6, 0, TAU)
          ctx.fill()
          ctx.globalAlpha = 1
          ctx.beginPath()
          ctx.arc(x, y, p.width * 1.2, 0, TAU)
          ctx.fill()
        }
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      // Nodos: traza de circuito, núcleo que late y anillo que se expande.
      for (const n of nodes) {
        const x = n.x * geo.w + sx * n.z
        const y = wrap(n.y * geo.h - geo.scroll * SCROLL.nodes * n.z, geo.h) + sy * n.z
        const k = (time / n.period + n.phase) % 1
        ctx.strokeStyle = n.color
        ctx.fillStyle = n.color
        ctx.globalAlpha = 0.22
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x + n.trace[0], y)
        ctx.lineTo(x + n.trace[0], y + n.trace[1])
        ctx.stroke()
        ctx.fillRect(x + n.trace[0] - 2, y + n.trace[1] - 2, 4, 4)
        ctx.globalAlpha = 0.55 * (1 - k)
        ctx.beginPath()
        ctx.arc(x, y, 3 + 14 * k, 0, TAU)
        ctx.stroke()
        ctx.globalAlpha = 0.5 + 0.4 * Math.sin(k * TAU)
        ctx.beginPath()
        ctx.arc(x, y, 3, 0, TAU)
        ctx.fill()
      }
      // Partículas, cada una con su profundidad y un parpadeo lento.
      for (const p of particles) {
        ctx.globalAlpha = p.alpha * (0.65 + 0.35 * Math.sin(time * 1.3 + p.phase))
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x + sx * p.z, wrap(p.y - geo.scroll * 0.5 * p.z, geo.h) + sy * p.z, p.r, 0, TAU)
        ctx.fill()
      }
      ctx.globalAlpha = 1
      // Retícula y horizonte: el compositor las desplaza, no se repintan.
      grid.current?.style.setProperty("transform", `translate3d(${(sx * 0.3).toFixed(2)}px, ${(sy * 0.3 - ((geo.scroll * SCROLL.grid) % GRID)).toFixed(2)}px, 0)`)
      const travel = document.documentElement.scrollHeight - geo.h
      const progress = travel > 0 ? Math.min(1, geo.scroll / travel) : 0
      band.current?.style.setProperty("transform", `translate3d(${(sx * 0.4 - progress * 96).toFixed(2)}px, ${(sy * 0.3).toFixed(2)}px, 0)`)
    }

    const step = (dt: number) => {
      time += dt
      packets.forEach((p, i) => {
        p.u += (p.speed * dt) / lengths[p.route]
        if (p.u - p.tail / lengths[p.route] > 1) packets[i] = spawn(false)
      })
      for (const p of particles) {
        p.x += p.vx * dt
        p.y += p.vy * dt
        if (p.x < -4) p.x += geo.w + 8
        else if (p.x > geo.w + 4) p.x -= geo.w + 8
      }
      if (autopilot) {
        target.x = 0.7 * Math.sin(time * SPEED.autopilot)
        target.y = 0.7 * Math.cos(time * SPEED.autopilot * 0.77)
      }
      // Lerp independiente de la tasa de refresco.
      const k = 1 - Math.pow(1 - SPEED.follow, dt * 60)
      view.x += (target.x - view.x) * k
      view.y += (target.y - view.y) * k
      geo.scroll = window.scrollY
    }

    const resize = () => {
      const box = el.getBoundingClientRect()
      // Sólo un cambio de ancho reparte de nuevo; la barra del navegador móvil cambia el alto al hacer scroll.
      const reseed = Math.abs(box.width - geo.w) > 1 || !packets.length
      dpr = Math.min(window.devicePixelRatio || 1, DENSITY.maxDpr)
      canvas.width = Math.round(box.width * dpr)
      canvas.height = Math.round(box.height * dpr)
      Object.assign(geo, { w: box.width, h: box.height, scroll: window.scrollY, gutter: Math.max(12, (box.width - 1280) / 4 + 12) })
      lengths = Array.from({ length: ROUTES }, (_, r) => {
        let length = 0
        let prev = route(r, 0, 0, geo)
        for (let i = 1; i <= 32; i++) {
          const point = route(r, i / 32, 0, geo)
          length += Math.hypot(point[0] - prev[0], point[1] - prev[1])
          prev = point
        }
        return length || 1
      })
      if (reseed) {
        // El coste de relleno crece con dpr²: a 1,5x, cuatro quintos de los elementos.
        const budget = 2 / (1 + dpr)
        const count = (size: number, every: number, [min, max]: readonly [number, number]) =>
          Math.round(Math.min(max, Math.max(min, (size / every) * budget)))
        const area = geo.w * geo.h
        packets = Array.from({ length: count(geo.w, DENSITY.packetEvery, DENSITY.packets) }, () => spawn(true))
        nodes = Array.from({ length: count(area, DENSITY.nodeEvery, DENSITY.nodes) }, node)
        particles = Array.from({ length: count(area, DENSITY.particleEvery, DENSITY.particles) }, particle)
      }
      draw()
    }

    let raf = 0
    let last = 0
    const frame = (now: number) => {
      step(Math.min(0.05, Math.max(0, (now - last) / 1000)))
      last = now
      draw()
      raf = requestAnimationFrame(frame)
    }
    const sync = () => {
      const run = motion && !document.hidden && !pausedRef.current
      if (run && !raf) {
        last = performance.now()
        raf = requestAnimationFrame(frame)
      } else if (!run && raf) {
        cancelAnimationFrame(raf)
        raf = 0
      }
      if (run) delete el.dataset.paused
      else el.dataset.paused = ""
    }
    const follow = (event: PointerEvent) => {
      target.x = (event.clientX / window.innerWidth) * 2 - 1
      target.y = (event.clientY / window.innerHeight) * 2 - 1
    }

    const ro = new ResizeObserver(resize)
    ro.observe(el)
    document.addEventListener("visibilitychange", sync)
    if (motion && !autopilot) window.addEventListener("pointermove", follow, { passive: true })
    syncRef.current = sync
    sync()
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      document.removeEventListener("visibilitychange", sync)
      window.removeEventListener("pointermove", follow)
      syncRef.current = () => {}
    }
  }, [])

  return (
    <div ref={root} className="gb pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
      <div ref={grid} className="gb-grid" />
      <svg ref={band} className="gb-band" viewBox="0 0 1440 300" preserveAspectRatio="xMidYMax slice" fill="none" stroke={COLORS.ink} focusable="false">
        <path d={GROUND} strokeOpacity="0.07" />
        <path d={FLOORS} strokeOpacity="0.07" />
        <path d={CONSTRUCTION} strokeOpacity="0.09" strokeDasharray="2 5" />
        <path d={SKYLINE} stroke={COLORS.cobalt} strokeOpacity="0.16" />
      </svg>
      <canvas className="gb-canvas" />
    </div>
  )
}
