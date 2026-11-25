"use client"

import * as React from "react"
import { Pause, Play } from "lucide-react"
import { buttonVariants } from "@/components/ui/button-variants"
import type { Language } from "@/lib/language"
import { cn } from "@/lib/utils"
import { FINE_POINTER, matches, MOTION_OK } from "./media"

/* ── Parámetros ajustables ─────────────────────────────────────────────────── */

/** Velocidades. Paquetes y deriva en px/s; ondas y piloto automático en rad/s. */
const SPEED = {
  packet: [70, 150] as const, // px/s de cada paquete de datos (mín., máx.)
  wave: 0.35, // rad/s: ondulación de las rutas por las que viajan
  drift: 7, // px/s: deriva máxima de las partículas
  follow: 0.08, // lerp: fracción del camino hacia el cursor en cada fotograma a 60 fps
  autopilot: 0.22, // rad/s: parallax autónomo cuando no hay ratón (táctil)
}

/** Paleta editorial: papel, tinta, cobalto y terracota. */
const COLORS = { paper: "#F5F0E8", ink: "#15171C", cobalt: "#253BD6", terracotta: "#ECA888" }

/** Densidad según el ancho y el área visible; con más dpr, menos elementos (tope 2x). */
const DENSITY = {
  packetEvery: 170, // un paquete por cada N px de ancho del hero
  packets: [4, 12] as const, // mín., máx.
  particleEvery: 5000, // una partícula por cada N px² de superficie visible
  particles: [12, 48] as const, // mín., máx.
  maxDpr: 2,
}

const PARALLAX = 16 // px que se desplaza la capa más cercana
const TRAIL = 14 // tramos de cada estela
const TAU = Math.PI * 2

/* ── Capas 1 y 2: geometría SVG (viewBox 1440 × 300, horizonte en y = 236) ─── */

const HORIZON = 236
/** Perfil arquitectónico: [x inicial, x final, altura sobre el horizonte]. */
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
/** Nodos: esquinas de las torres e intersecciones del horizonte y el suelo. */
const NODES = [
  [24, 144], [64, 206], [300, 192], [560, 178], [700, 140], [730, 196], [960, 116], [1010, 172],
  [1230, 88], [1262, 184], [420, 236], [850, 236], [1150, 236], [610, 259], [1060, 277], [180, 277],
] as const

/* ── Capas 3 y 4: canvas ───────────────────────────────────────────────────── */

type Point = [number, number]
/** Medidas del hero: ancho, alto, franja inferior y margen lateral (globals.css, `.hb`). */
type Geo = { w: number; h: number; floor: number; gutter: number }
/** Rutas en px a partir de la fracción `u` del recorrido: tres por la franja inferior y dos por los márgenes. */
const ROUTES: ((u: number, t: number, g: Geo) => Point)[] = [
  (u, t, g) => [u * g.w, g.h - g.floor * (0.62 + 0.06 * Math.sin(u * 7 + t * SPEED.wave))],
  (u, t, g) => [(1 - u) * g.w, g.h - g.floor * (0.4 + 0.05 * Math.sin(u * 11 + 1.7 + t * SPEED.wave * 1.3))],
  (u, t, g) => [u * g.w, g.h - g.floor * (0.17 + 0.04 * Math.sin(u * 5 + 3.1 - t * SPEED.wave))],
  (u, t, g) => [g.gutter / 2 + 4 * Math.sin(u * 6 + t * SPEED.wave), g.h - 0.6 * g.h * u],
  (u, t, g) => [g.w - g.gutter / 2 + 4 * Math.sin(u * 6 + 2 + t * SPEED.wave), g.h - 0.6 * g.h * u],
]
/** Superficies donde se ve cada ruta: 0 franja inferior, 1 margen izquierdo, 2 margen derecho. */
const ROUTE_SURFACES = [[0], [0], [0], [0, 1], [0, 2]]

type Surface = { ctx: CanvasRenderingContext2D; canvas: HTMLCanvasElement; x: number; y: number; w: number; h: number }
type Packet = { route: number; u: number; speed: number; tail: number; width: number; color: string }
type Particle = { surface: number; x: number; y: number; z: number; r: number; vx: number; vy: number; phase: number; alpha: number; color: string }

const rand = (min: number, max: number) => min + Math.random() * (max - min)

const LABEL = { es: "Pausar la animación del fondo", en: "Pause the background animation" } as const

/**
 * Fondo del hero generado por código: retícula isométrica y horizonte
 * arquitectónico (SVG), nodos que laten (SVG + CSS), estelas de datos y
 * partículas (canvas). Todo va detrás del contenido y con `aria-hidden`.
 *
 * Sólo se pinta donde no hay texto: la franja del padding inferior y los
 * márgenes laterales fuera del contenedor. El titular y los botones quedan
 * sobre papel liso y axe puede medir su contraste.
 *
 * - Escritorio (puntero fino): parallax por capas que sigue al cursor con lerp.
 * - Táctil: el mismo parallax en piloto automático, sin listeners de puntero.
 * - Un solo bucle `requestAnimationFrame`, parado fuera de pantalla
 *   (IntersectionObserver), con la pestaña oculta o tras pulsar «pausa».
 * - Movimiento reducido: un único fotograma estático, sin bucle ni latidos.
 *
 * El SVG llega en el HTML; el canvas se dibuja al hidratar. Nada ocupa sitio
 * en el flujo (CLS 0) y el botón de pausa cumple WCAG 2.2.2.
 */
export function ProceduralHeroBackdrop({ lang }: { lang: Language }) {
  const root = React.useRef<HTMLDivElement>(null)
  const band = React.useRef<SVGSVGElement>(null)
  const nodes = React.useRef<HTMLDivElement>(null)
  const [paused, setPaused] = React.useState(false)
  const pausedRef = React.useRef(false)
  const syncRef = React.useRef(() => {})

  React.useEffect(() => {
    pausedRef.current = paused
    syncRef.current()
  }, [paused])

  React.useEffect(() => {
    const el = root.current
    if (!el) return
    const surfaces: Surface[] = []
    for (const canvas of el.querySelectorAll("canvas")) {
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      surfaces.push({ ctx, canvas, x: 0, y: 0, w: 0, h: 0 })
    }
    const motion = matches(MOTION_OK)
    const autopilot = !matches(FINE_POINTER)
    const layers = [
      [band.current, 0.3],
      [nodes.current, 0.5],
    ] as const
    const geo: Geo = { w: 0, h: 0, floor: 0, gutter: 0 }
    const target = { x: 0, y: 0 }
    const view = { x: 0, y: 0 }
    let dpr = 1
    let time = 0
    let lengths: number[] = []
    let packets: Packet[] = []
    let particles: Particle[] = []

    const spawn = (scatter: boolean): Packet => ({
      // Siete de cada diez van por abajo; el resto sube por los márgenes.
      route: Math.random() < 0.7 ? Math.floor(Math.random() * 3) : 3 + Math.floor(Math.random() * 2),
      u: scatter ? Math.random() : 0,
      speed: rand(...SPEED.packet),
      tail: rand(50, 150),
      width: rand(1.2, 2.2),
      color: Math.random() < 0.62 ? COLORS.cobalt : COLORS.terracotta,
    })
    const particle = (surface: number): Particle => {
      const s = surfaces[surface]
      const tone = Math.random()
      return {
        surface,
        x: rand(s.x, s.x + s.w),
        y: rand(s.y, s.y + s.h),
        z: rand(0.3, 1),
        r: rand(0.6, 1.7),
        vx: rand(-1, 1) * SPEED.drift,
        vy: -rand(0.2, 1) * SPEED.drift,
        phase: rand(0, TAU),
        alpha: tone < 0.7 ? rand(0.08, 0.16) : rand(0.18, 0.32),
        color: tone < 0.7 ? COLORS.ink : tone < 0.88 ? COLORS.cobalt : COLORS.terracotta,
      }
    }

    const draw = () => {
      const sx = -view.x * PARALLAX
      const sy = -view.y * PARALLAX
      surfaces.forEach((s, index) => {
        const { ctx } = s
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx.clearRect(0, 0, s.w, s.h)
        ctx.lineCap = "round"
        // Capa 3: rieles tenues y paquetes con estela que se afina hacia atrás.
        ctx.translate(sx * 0.6 - s.x, sy * 0.6 - s.y)
        ctx.globalAlpha = 0.07
        ctx.strokeStyle = COLORS.ink
        ctx.lineWidth = 1
        ROUTES.forEach((route, r) => {
          if (!ROUTE_SURFACES[r].includes(index)) return
          ctx.beginPath()
          for (let i = 0; i <= 48; i++) {
            const [x, y] = route(i / 48, time, geo)
            if (i) ctx.lineTo(x, y)
            else ctx.moveTo(x, y)
          }
          ctx.stroke()
        })
        for (const p of packets) {
          if (!ROUTE_SURFACES[p.route].includes(index)) continue
          const route = ROUTES[p.route]
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
            const point = route(u, time, geo)
            if (prev) {
              const fade = 1 - k / TRAIL
              ctx.globalAlpha = 0.6 * fade * fade
              ctx.lineWidth = p.width * (0.4 + 0.6 * fade)
              ctx.beginPath()
              ctx.moveTo(prev[0], prev[1])
              ctx.lineTo(point[0], point[1])
              ctx.stroke()
            }
            prev = point
          }
          if (p.u >= 0 && p.u <= 1) {
            const [x, y] = route(p.u, time, geo)
            ctx.globalAlpha = 0.14
            ctx.beginPath()
            ctx.arc(x, y, p.width * 3.2, 0, TAU)
            ctx.fill()
            ctx.globalAlpha = 0.9
            ctx.beginPath()
            ctx.arc(x, y, p.width * 1.1, 0, TAU)
            ctx.fill()
          }
        }
        // Capa 4: partículas, cada una con su profundidad y un parpadeo lento.
        ctx.setTransform(dpr, 0, 0, dpr, -s.x * dpr, -s.y * dpr)
        for (const p of particles) {
          if (p.surface !== index) continue
          ctx.globalAlpha = p.alpha * (0.65 + 0.35 * Math.sin(time * 1.3 + p.phase))
          ctx.fillStyle = p.color
          ctx.beginPath()
          ctx.arc(p.x + sx * p.z, p.y + sy * p.z, p.r, 0, TAU)
          ctx.fill()
        }
        ctx.globalAlpha = 1
      })
      // Capas 1 y 2 (SVG): el compositor las desplaza, no se repintan.
      for (const [layer, depth] of layers) {
        layer?.style.setProperty("transform", `translate3d(${(sx * depth).toFixed(2)}px, ${(sy * depth).toFixed(2)}px, 0)`)
      }
    }

    const step = (dt: number) => {
      time += dt
      packets.forEach((p, i) => {
        p.u += (p.speed * dt) / lengths[p.route]
        if (p.u - p.tail / lengths[p.route] > 1) packets[i] = spawn(false)
      })
      for (const p of particles) {
        const s = surfaces[p.surface]
        p.x += p.vx * dt
        p.y += p.vy * dt
        if (p.y < s.y - 4) {
          p.y = s.y + s.h + 4
          p.x = rand(s.x, s.x + s.w)
        }
        if (p.x < s.x - 4) p.x += s.w + 8
        else if (p.x > s.x + s.w + 4) p.x -= s.w + 8
      }
      if (autopilot) {
        target.x = 0.7 * Math.sin(time * SPEED.autopilot)
        target.y = 0.7 * Math.cos(time * SPEED.autopilot * 0.77)
      }
      // Lerp independiente de la tasa de refresco.
      const k = 1 - Math.pow(1 - SPEED.follow, dt * 60)
      view.x += (target.x - view.x) * k
      view.y += (target.y - view.y) * k
    }

    const resize = () => {
      const box = el.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, DENSITY.maxDpr)
      for (const s of surfaces) {
        const rect = s.canvas.getBoundingClientRect()
        Object.assign(s, { x: rect.left - box.left, y: rect.top - box.top, w: rect.width, h: rect.height })
        s.canvas.width = Math.round(s.w * dpr)
        s.canvas.height = Math.round(s.h * dpr)
      }
      Object.assign(geo, { w: box.width, h: box.height, floor: surfaces[0].h, gutter: surfaces[1].w })
      // El coste de relleno crece con dpr²: a 2x, dos tercios de los elementos.
      const budget = 2 / (1 + dpr)
      const count = (size: number, every: number, [min, max]: readonly [number, number]) =>
        Math.round(Math.min(max, Math.max(min, (size / every) * budget)))
      lengths = ROUTES.map((route) => {
        let length = 0
        let prev = route(0, 0, geo)
        for (let i = 1; i <= 32; i++) {
          const point = route(i / 32, 0, geo)
          length += Math.hypot(point[0] - prev[0], point[1] - prev[1])
          prev = point
        }
        return length || 1
      })
      packets = Array.from({ length: count(geo.w, DENSITY.packetEvery, DENSITY.packets) }, () => spawn(true))
      // Partículas repartidas según el área de cada superficie.
      const areas = surfaces.map((s) => s.w * s.h)
      const total = areas.reduce((sum, area) => sum + area, 0) || 1
      particles = Array.from({ length: count(total, DENSITY.particleEvery, DENSITY.particles) }, () => {
        let pick = Math.random() * total
        const surface = Math.max(0, areas.findIndex((area) => (pick -= area) < 0))
        return particle(surface)
      })
      draw()
    }

    let raf = 0
    let last = 0
    let visible = false
    const frame = (now: number) => {
      step(Math.min(0.05, Math.max(0, (now - last) / 1000)))
      last = now
      draw()
      raf = requestAnimationFrame(frame)
    }
    const sync = () => {
      const run = motion && visible && !document.hidden && !pausedRef.current
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

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      sync()
    })
    const ro = new ResizeObserver(resize)
    ro.observe(el)
    io.observe(el)
    document.addEventListener("visibilitychange", sync)
    if (motion && !autopilot) window.addEventListener("pointermove", follow, { passive: true })
    syncRef.current = sync
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      document.removeEventListener("visibilitychange", sync)
      window.removeEventListener("pointermove", follow)
      syncRef.current = () => {}
    }
  }, [])

  return (
    <>
      <div ref={root} className="hb" aria-hidden="true">
        <div className="hb-floor">
          {/* Capa 1: retícula isométrica a ±30° y horizonte arquitectónico. */}
          <svg className="hb-grid" focusable="false">
            <pattern id="hb-iso" width="52" height="30" patternUnits="userSpaceOnUse">
              <path d="M0 0L52 30M52 0L0 30M0 0V30" fill="none" stroke={COLORS.ink} strokeOpacity="0.045" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#hb-iso)" />
          </svg>
          <svg ref={band} className="hb-band" viewBox="0 0 1440 300" preserveAspectRatio="xMidYMax slice" fill="none" stroke={COLORS.ink} focusable="false">
            <path d={GROUND} strokeOpacity="0.05" />
            <path d={FLOORS} strokeOpacity="0.05" />
            <path d={CONSTRUCTION} strokeOpacity="0.06" strokeDasharray="2 5" />
            <path d={SKYLINE} strokeOpacity="0.07" />
          </svg>
          {/* Capa 2: nodos que laten a destiempo. Cada uno es un <svg> propio
              para que el latido (opacidad y escala) lo anime el compositor. */}
          <div ref={nodes} className="hb-nodes">
            {NODES.map(([x, y], i) => (
              <span
                key={i}
                className="hb-node"
                style={{ "--x": x, "--y": y, "--d": `${(-i * 0.47).toFixed(2)}s`, "--dur": `${3.2 + (i % 4) * 0.55}s` } as React.CSSProperties}
              >
                {["hb-ring", "hb-core"].map((part) => (
                  <svg key={part} className={part} viewBox="0 0 6 6" focusable="false">
                    <circle cx="3" cy="3" r="3" fill={i % 3 === 2 ? COLORS.terracotta : COLORS.cobalt} />
                  </svg>
                ))}
              </span>
            ))}
          </div>
          {/* Capas 3 y 4: estelas de datos y partículas, una superficie por zona. */}
          <canvas className="hb-canvas" />
        </div>
        <div className="hb-side hb-side-left">
          <canvas className="hb-canvas" />
        </div>
        <div className="hb-side hb-side-right">
          <canvas className="hb-canvas" />
        </div>
      </div>
      <button
        type="button"
        aria-pressed={paused}
        aria-label={LABEL[lang]}
        onClick={() => setPaused((value) => !value)}
        className={cn(buttonVariants({ variant: "secondary" }), "absolute right-4 bottom-4 size-11 bg-background/85 px-0 motion-reduce:hidden")}
      >
        {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
      </button>
    </>
  )
}
