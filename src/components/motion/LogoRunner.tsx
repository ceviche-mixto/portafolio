"use client"

import * as React from "react"
import { Pause, Play } from "lucide-react"
import { buttonVariants } from "@/components/ui/button-variants"
import { cn } from "@/lib/utils"
import { matches, MOTION_OK } from "./media"
import { setMotionPaused, useMotionPaused } from "./motion-pause"

const LOGO = "/images/brand/logo-ceviche.webp"
const COLORS = { cyan: "#00F0FF", magenta: "#FF2A85", cobalt: "#4F63FF", ink: "#0B0D12" }
const TRAIL = [COLORS.cyan, COLORS.magenta, COLORS.cobalt]

/** Física de la escena, en px y segundos. */
const RUN = {
  speed: 250, // px/s de la pista
  gap: 400, // px entre grupos de pinchos: ritmo constante
  air: 0.6, // s en el aire por salto
  height: 54, // px del vértice del salto
  radius: 17, // px del logo
  spike: 24, // px de base y altura de cada pincho
  floor: 30, // px de pista bajo la línea de suelo
}
/** Grupos de pinchos en bucle: uno se salta con media vuelta, dos con vuelta entera. */
const PATTERN = [1, 1, 2, 1, 2, 2] as const
const MAX_DPR = 2
const TAU = Math.PI * 2

type Spike = { x: number; count: 1 | 2 }
type Spark = { x: number; y: number; vx: number; vy: number; life: number; ttl: number; size: number; color: string }

const rand = (min: number, max: number) => min + Math.random() * (max - min)
const noop = () => () => {}

/**
 * Escena a 60 fps en canvas: el logo rueda por una pista neón en perspectiva
 * y salta solo los pinchos, con media vuelta (uno) o vuelta entera (dos) en
 * el aire, estela de píxeles cian/magenta/cobalto y destello al aterrizar.
 *
 * - Clic, toque o Espacio con el foco en la escena: salto extra con estela de
 *   celebración. Es un `<button>` superpuesto, así que Espacio no desplaza la
 *   página y la escena no escucha el teclado global ni bloquea el scroll.
 * - Un solo bucle `requestAnimationFrame`, parado fuera de pantalla, con la
 *   pestaña oculta o tras «pausa». El botón de pausa es compartido con el
 *   fondo global (`motion-pause`, WCAG 2.2.2).
 * - Movimiento reducido: un fotograma estático (logo quieto ante los pinchos),
 *   sin bucle ni controles.
 *
 * La franja tiene alto fijo (CLS 0) y el canvas es decorativo (`aria-hidden`).
 */
export function LogoRunner({ jumpLabel, pauseLabel, hint }: { jumpLabel: string; pauseLabel: string; hint: string }) {
  const root = React.useRef<HTMLDivElement>(null)
  const jumpRef = React.useRef(() => {})
  const syncRef = React.useRef(() => {})
  const pausedRef = React.useRef(false)
  const paused = useMotionPaused()
  // Falso en el servidor y al hidratar; los controles aparecen después, sin mover nada.
  const motion = React.useSyncExternalStore(noop, () => matches(MOTION_OK), () => false)

  React.useEffect(() => {
    pausedRef.current = paused
    syncRef.current()
  }, [paused])

  React.useEffect(() => {
    const el = root.current
    const canvas = el?.querySelector("canvas")
    const ctx = canvas?.getContext("2d")
    if (!el || !canvas || !ctx) return
    const animate = matches(MOTION_OK)
    const logo = new Image()
    let ready = false
    let w = 0
    let h = 0
    let dpr = 1
    let distance = 0
    let pattern = 0
    let next = RUN.gap
    let spikes: Spike[] = []
    let sparks: Spark[] = []
    let rings: { x: number; age: number }[] = []
    // Salto en curso: progreso 0–1 (−1 en el suelo), altura de partida, giro inicial y giro total.
    const jump = { t: -1, from: 0, rot: 0, turn: 0 }
    let rot = 0

    const playerX = () => Math.max(64, w * 0.22)
    const ground = () => h - RUN.floor
    const height = () => (jump.t < 0 ? 0 : jump.from * (1 - jump.t) + 4 * RUN.height * jump.t * (1 - jump.t))
    const burst = (x: number, y: number, count: number, spread: number) => {
      for (let i = 0; i < count; i++) {
        const angle = rand(Math.PI, TAU)
        const speed = rand(40, spread)
        sparks.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 0, ttl: rand(0.35, 0.7), size: rand(2, 4), color: TRAIL[i % 3] })
      }
    }
    const leap = (turn: number) => {
      // Desde el aire, el nuevo salto parte de la altura actual (con tope para no salir del cuadro).
      jump.from = Math.min(height(), RUN.height * 0.6)
      jump.rot = rot
      jump.turn = turn
      jump.t = 0
    }

    const seed = () => {
      const px = playerX()
      spikes = []
      for (let x = px + 280; x < w + RUN.gap; x += RUN.gap) {
        spikes.push({ x, count: PATTERN[pattern++ % PATTERN.length] })
      }
      next = spikes.length ? spikes[spikes.length - 1].x + RUN.gap - w : RUN.gap
    }

    const step = (dt: number) => {
      const dx = RUN.speed * dt
      const px = playerX()
      distance += dx
      for (const spike of spikes) spike.x -= dx
      spikes = spikes.filter((spike) => spike.x + spike.count * RUN.spike > -8)
      next -= dx
      if (next <= 0) {
        spikes.push({ x: w + 8, count: PATTERN[pattern++ % PATTERN.length] })
        next += RUN.gap
      }
      if (jump.t >= 0) {
        jump.t += dt / RUN.air
        rot = jump.rot + jump.turn * Math.min(1, jump.t)
        if (jump.t >= 1) {
          jump.t = -1
          rot %= TAU
          rings.push({ x: px, age: 0 })
          burst(px, ground(), 10, 120)
        }
      } else {
        // Salto automático: el vértice cae sobre el centro del grupo de pinchos.
        const ahead = spikes.find((spike) => spike.x + spike.count * RUN.spike > px)
        if (ahead) {
          const center = ahead.x + (ahead.count * RUN.spike) / 2 - px
          if (center > 0 && center <= (RUN.speed * RUN.air) / 2) leap(ahead.count === 1 ? Math.PI : TAU)
        }
      }
      // Estela de píxeles detrás del logo.
      const y = ground() - RUN.radius - height()
      for (let i = 0; i < 2; i++) {
        sparks.push({ x: px - RUN.radius * 0.7, y: y + rand(-RUN.radius, RUN.radius) * 0.6, vx: -RUN.speed * 0.45 + rand(-20, 20), vy: rand(-14, 14), life: 0, ttl: rand(0.3, 0.5), size: rand(1.5, 3), color: TRAIL[(distance / 9 + i) % 3 | 0] })
      }
      for (const spark of sparks) {
        spark.life += dt
        spark.x += spark.vx * dt
        spark.y += spark.vy * dt
        spark.vy += 160 * dt
      }
      sparks = sparks.filter((spark) => spark.life < spark.ttl).slice(-140)
      for (const ring of rings) {
        ring.age += dt
        ring.x -= dx
      }
      rings = rings.filter((ring) => ring.age < 0.45)
    }

    const draw = () => {
      const gy = ground()
      const px = playerX()
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      ctx.lineCap = "round"
      // Retícula del fondo: columnas que pasan a un tercio de la velocidad.
      ctx.strokeStyle = COLORS.cobalt
      ctx.lineWidth = 1
      ctx.globalAlpha = 0.22
      ctx.beginPath()
      for (let x = -(distance * 0.35) % 32; x < w; x += 32) {
        ctx.moveTo(x, 0)
        ctx.lineTo(x, gy)
      }
      for (let y = gy - 24; y > 0; y -= 24) {
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
      }
      ctx.stroke()
      // Suelo en perspectiva: fuga sobre el centro y paralelas cada vez más separadas.
      const vx = w / 2
      const vy = gy - 90
      ctx.strokeStyle = COLORS.cyan
      ctx.globalAlpha = 0.28
      ctx.beginPath()
      for (let x = -(distance % 48) - w; x < w * 2; x += 48) {
        ctx.moveTo(vx + (x - vx) * ((gy - vy) / (h - vy)), gy)
        ctx.lineTo(x, h)
      }
      for (let k = 1; k <= 3; k++) {
        const y = gy + RUN.floor * (k / 3) ** 1.6
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
      }
      ctx.stroke()
      // Línea de suelo con halo.
      for (const [width, alpha] of [[7, 0.18], [1.5, 1]] as const) {
        ctx.globalAlpha = alpha
        ctx.lineWidth = width
        ctx.beginPath()
        ctx.moveTo(0, gy)
        ctx.lineTo(w, gy)
        ctx.stroke()
      }
      // Pinchos neón: cuerpo de tinta, borde magenta con halo.
      ctx.fillStyle = COLORS.ink
      ctx.strokeStyle = COLORS.magenta
      ctx.lineJoin = "round"
      for (const spike of spikes) {
        ctx.beginPath()
        for (let k = 0; k < spike.count; k++) {
          const x = spike.x + k * RUN.spike
          ctx.moveTo(x, gy)
          ctx.lineTo(x + RUN.spike / 2, gy - RUN.spike)
          ctx.lineTo(x + RUN.spike, gy)
          ctx.closePath()
        }
        ctx.globalAlpha = 1
        ctx.fill()
        for (const [width, alpha] of [[6, 0.22], [1.6, 1]] as const) {
          ctx.globalAlpha = alpha
          ctx.lineWidth = width
          ctx.stroke()
        }
      }
      // Destellos de aterrizaje: elipse que se abre sobre el suelo.
      ctx.strokeStyle = COLORS.cyan
      ctx.lineWidth = 2
      for (const ring of rings) {
        const k = ring.age / 0.45
        ctx.globalAlpha = 0.9 * (1 - k)
        ctx.beginPath()
        ctx.ellipse(ring.x, gy, 8 + 34 * k, 2 + 6 * k, 0, 0, TAU)
        ctx.stroke()
      }
      // Estela: cuadrados, no círculos, para que se lea como píxel.
      for (const spark of sparks) {
        ctx.globalAlpha = 0.85 * (1 - spark.life / spark.ttl)
        ctx.fillStyle = spark.color
        ctx.fillRect(spark.x - spark.size / 2, spark.y - spark.size / 2, spark.size, spark.size)
      }
      // Logo: halo, imagen recortada en círculo y aro cian.
      const r = RUN.radius
      ctx.save()
      ctx.translate(px, gy - r - height())
      ctx.rotate(rot)
      ctx.globalAlpha = 0.3
      ctx.fillStyle = COLORS.cyan
      ctx.beginPath()
      ctx.arc(0, 0, r + 5, 0, TAU)
      ctx.fill()
      ctx.globalAlpha = 1
      ctx.beginPath()
      ctx.arc(0, 0, r, 0, TAU)
      ctx.save()
      ctx.clip()
      if (ready) ctx.drawImage(logo, -r, -r, r * 2, r * 2)
      else {
        ctx.fillStyle = COLORS.cobalt
        ctx.fillRect(-r, -r, r * 2, r * 2)
      }
      ctx.restore()
      ctx.strokeStyle = COLORS.cyan
      ctx.lineWidth = 1.5
      ctx.stroke()
      ctx.restore()
      ctx.globalAlpha = 1
    }

    const resize = () => {
      const box = el.getBoundingClientRect()
      const wider = Math.abs(box.width - w) > 1
      w = box.width
      h = box.height
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      if (wider) seed()
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
      const run = animate && visible && !document.hidden && !pausedRef.current
      if (run && !raf) {
        last = performance.now()
        raf = requestAnimationFrame(frame)
      } else if (!run && raf) {
        cancelAnimationFrame(raf)
        raf = 0
      }
    }
    jumpRef.current = () => {
      if (!animate) return
      leap(jump.t < 0 ? Math.PI : TAU)
      burst(playerX(), ground() - RUN.radius - height(), 22, 220)
      if (!raf) draw()
    }

    logo.onload = () => {
      ready = true
      if (!raf) draw()
    }
    logo.src = LOGO
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      sync()
    })
    const ro = new ResizeObserver(resize)
    ro.observe(el)
    io.observe(el)
    document.addEventListener("visibilitychange", sync)
    syncRef.current = sync
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      document.removeEventListener("visibilitychange", sync)
      logo.onload = null
      syncRef.current = () => {}
      jumpRef.current = () => {}
    }
  }, [])

  return (
    <div ref={root} className="runner relative h-[128px] overflow-clip">
      <canvas aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" />
      {motion && (
        <>
          <button
            type="button"
            aria-label={jumpLabel}
            onClick={() => jumpRef.current()}
            className="absolute inset-0 cursor-pointer focus-visible:outline-offset-[-4px] focus-visible:outline-[#00F0FF]"
          />
          <p aria-hidden="true" className="pointer-events-none absolute bottom-2 left-10 font-mono text-[11px] tracking-[0.18em] text-[#9aa5ff] uppercase">
            {hint}
          </p>
          <button
            type="button"
            aria-pressed={paused}
            aria-label={pauseLabel}
            onClick={() => setMotionPaused(!paused)}
            className={cn(buttonVariants({ variant: "secondary" }), "absolute top-2 right-2 size-10 border-[#00F0FF]/40 bg-[#0B0D12]/80 px-0 text-[#00F0FF]")}
          >
            {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
          </button>
        </>
      )}
    </div>
  )
}
