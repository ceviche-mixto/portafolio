"use client"

import * as React from "react"
import { matches, MOTION_OK } from "./media"
import { useMotionPaused } from "./motion-pause"

const LOGO = "/images/brand/logo-ceviche.webp"
const COLORS = { cyan: "#00F0FF", magenta: "#FF2A85", cobalt: "#253BD6", glow: "#4F63FF", terracotta: "#ECA888", ink: "#12151E" }
const TRAIL = [COLORS.cyan, COLORS.glow, COLORS.cobalt]
const DEBRIS = [COLORS.cyan, COLORS.magenta, COLORS.cobalt, COLORS.terracotta]

/** Medidas en px para una pista de 140 px de alto; todo escala con el alto real (`s`, ver `.runner`). */
const SIZE = { radius: 17, spike: 22, pad: 30, hop: 50, launch: 88, floor: 30, enter: 64 }
/** Tiempos en segundos y velocidad en px/s. */
const RUN = {
  cross: 5.2, // s que tarda en cruzar: la velocidad es ancho / cross…
  speed: [150, 560] as const, // …acotada para que en móvil no pase volando ni en 4K se eternice
  air: 0.6, // s mínimos en el aire por salto
  launchAir: 0.95, // s de vuelo desde un pad
  rest: 0.9, // s fuera de pantalla antes de volver a entrar
  respawn: 1.8, // s tras la explosión hasta que sale otro logo
}
/** Obstáculos de izquierda a derecha, en bucle: grupos de 1–3 pinchos y pads de lanzamiento. */
const PATTERN = [1, 2, 0, 1, 3, 2, 0] as const // 0 = pad
const MAX_DPR = 2
const TAU = Math.PI * 2

type Obstacle = { x: number; count: number; air: number; flash: number }
type Bit = { x: number; y: number; vx: number; vy: number; life: number; ttl: number; size: number; color: string; gravity: number }
/** Onda: plana a ras de suelo (aterrizaje) o circular (explosión). */
type Ring = { x: number; y: number; age: number; ttl: number; from: number; to: number; color: string; flat: boolean }

const rand = (min: number, max: number) => min + Math.random() * (max - min)
const clamp = (value: number, [min, max]: readonly [number, number]) => Math.min(max, Math.max(min, value))

/**
 * Pista ambiental a todo el ancho del hero, como el fondo de la pantalla de
 * inicio de un juego de ritmo: el logo entra por la izquierda (−64 px), cruza
 * la pantalla solo, salta los pinchos neón con media vuelta (uno) o vuelta
 * entera (dos o tres), sale volando de los pads y, al salir por la derecha
 * (ancho + 64 px), vuelve a entrar tras una pausa breve.
 *
 * - Velocidad y reparto de obstáculos salen del ancho real (cruza en ~3–7 s
 *   de móvil a 4K) y los tamaños del alto, que es un `clamp()` en CSS.
 * - Easter egg: un clic o toque sobre el logo lo hace estallar en píxeles con
 *   onda expansiva; a los 1,8 s sale otro. El cursor pasa a `pointer` sólo
 *   sobre su hitbox. Se escucha `click` y no `pointerdown`, sin
 *   `preventDefault` ni `touch-action`: el scroll táctil no se bloquea.
 * - Un solo bucle `requestAnimationFrame`, parado fuera de pantalla, con la
 *   pestaña oculta o con la pausa compartida (`motion-pause`, botón en la cabecera).
 * - Movimiento reducido: un fotograma estático con el logo en reposo sobre la
 *   pista, sin bucle ni listeners.
 *
 * El alto es fijo desde CSS (CLS 0) y todo es decorativo (`aria-hidden`).
 */
export function LogoRunner() {
  const root = React.useRef<HTMLDivElement>(null)
  const syncRef = React.useRef(() => {})
  const pausedRef = React.useRef(false)
  const paused = useMotionPaused()

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
    let s = 1
    let dpr = 1
    let speed: number = RUN.speed[0]
    let time = 0
    let obstacles: Obstacle[] = []
    let bits: Bit[] = []
    let rings: Ring[] = []
    // El logo: posición, giro, salto en curso (progreso 0–1, −1 en el suelo) y fase.
    const player = { x: 0, rot: 0, next: 0, phase: "run" as "run" | "rest" | "boom", wait: 0 }
    const jump = { t: -1, air: 0, height: 0, from: 0, turn: 0 }
    const pointer = { x: 0, y: 0, inside: false, hover: false }

    const r = () => SIZE.radius * s
    const ground = () => h - SIZE.floor * s
    const lift = () => (jump.t < 0 ? 0 : 4 * jump.height * jump.t * (1 - jump.t))
    const center = (): [number, number] => [player.x, ground() - r() - lift()]
    const width = (o: Obstacle) => (o.count ? o.count * SIZE.spike * s : SIZE.pad * s)
    /** Dónde despega el logo: con el vértice sobre el centro del grupo de pinchos, o encima del pad. */
    const trigger = (o: Obstacle) => o.x + width(o) / 2 - (o.count ? (speed * o.air) / 2 : 0)

    // Obstáculos fijos en la pista: cada uno empieza donde el logo ya ha aterrizado del anterior.
    const layout = () => {
      obstacles = []
      const gap = clamp(w * 0.06, [40 * s, 300])
      let landing = Math.max(120 * s, w * 0.12) - gap
      for (let i = 0; ; i++) {
        const count = PATTERN[i % PATTERN.length]
        const o: Obstacle = { x: 0, count, air: 0, flash: 0 }
        o.air = count ? Math.max(RUN.air, (width(o) + 2.6 * r()) / speed) : RUN.launchAir
        const span = speed * o.air
        o.x = landing + Math.max(gap, count ? span / 2 - width(o) / 2 + 4 * s : 0)
        if (o.x + width(o) > w - 40 * s) break
        obstacles.push(o)
        landing = o.x + width(o) / 2 + (count ? span / 2 : span)
      }
      player.next = obstacles.findIndex((o) => trigger(o) >= player.x)
      if (player.next < 0) player.next = obstacles.length
    }

    const spawn = () => {
      player.x = -SIZE.enter
      player.rot = 0
      player.next = 0
      player.phase = "run"
      jump.t = -1
    }

    const leap = (o: Obstacle) => {
      jump.air = o.air
      jump.height = (o.count ? SIZE.hop : SIZE.launch) * s
      jump.from = player.rot
      jump.turn = o.count === 1 ? Math.PI : TAU
      jump.t = 0
      o.flash = 1
    }

    const spray = (x: number, y: number, count: number, power: number, colors: readonly string[], up: boolean) => {
      for (let i = 0; i < count; i++) {
        const angle = up ? rand(Math.PI, TAU) : rand(0, TAU)
        const v = rand(0.25, 1) * power * s
        bits.push({ x, y, vx: Math.cos(angle) * v, vy: Math.sin(angle) * v, life: 0, ttl: rand(0.35, up ? 0.7 : 1.3), size: rand(2, up ? 4 : 7) * s, color: colors[i % colors.length], gravity: (up ? 160 : 420) * s })
      }
    }

    const explode = () => {
      const [x, y] = center()
      spray(x, y, 56, 420, DEBRIS, false)
      // Ondas a la medida de la pista: el lienzo recorta lo que pasa de su borde superior.
      rings.push({ x, y, age: 0, ttl: 0.6, from: r(), to: r() + 70 * s, color: COLORS.cyan, flat: false })
      rings.push({ x, y, age: -0.08, ttl: 0.6, from: r(), to: r() + 48 * s, color: COLORS.magenta, flat: false })
      player.phase = "boom"
      player.wait = RUN.respawn
      el.style.cursor = ""
      pointer.hover = false
    }

    // Hitbox generoso (≥ 24 px de radio) para que el toque en móvil acierte.
    const hit = (x: number, y: number) => {
      if (player.phase !== "run") return false
      const [cx, cy] = center()
      return Math.hypot(x - cx, y - cy) <= Math.max(24, r() * 1.5)
    }

    const step = (dt: number) => {
      time += dt
      if (player.phase !== "run") {
        player.wait -= dt
        if (player.wait <= 0) spawn()
      } else {
        player.x += speed * dt
        if (jump.t >= 0) {
          jump.t += dt / jump.air
          player.rot = jump.from + jump.turn * Math.min(1, jump.t)
          if (jump.t >= 1) {
            jump.t = -1
            player.rot %= TAU
            rings.push({ x: player.x, y: ground(), age: 0, ttl: 0.45, from: 8 * s, to: 42 * s, color: COLORS.cyan, flat: true })
            spray(player.x, ground(), 10, 120, TRAIL, true)
          }
        }
        const ahead = obstacles[player.next]
        if (jump.t < 0 && ahead && player.x >= trigger(ahead)) {
          leap(ahead)
          player.next++
        }
        // Estela de píxeles cian/cobalto detrás del logo.
        const [x, y] = center()
        for (let i = 0; i < 2; i++) {
          bits.push({ x: x - r() * 0.7, y: y + rand(-0.6, 0.6) * r(), vx: -speed * 0.35 + rand(-20, 20), vy: rand(-14, 14), life: 0, ttl: rand(0.3, 0.55), size: rand(1.5, 3) * s, color: TRAIL[(i + Math.floor(time * 12)) % 3], gravity: 60 * s })
        }
        if (player.x > w + SIZE.enter) {
          player.phase = "rest"
          player.wait = RUN.rest
        }
      }
      for (const o of obstacles) o.flash = Math.max(0, o.flash - dt * 2.5)
      for (const bit of bits) {
        bit.life += dt
        bit.x += bit.vx * dt
        bit.y += bit.vy * dt
        bit.vy += bit.gravity * dt
      }
      bits = bits.filter((bit) => bit.life < bit.ttl).slice(-220)
      for (const ring of rings) ring.age += dt
      rings = rings.filter((ring) => ring.age < ring.ttl)
      // El logo se mueve bajo un cursor quieto: el hitbox se comprueba en cada fotograma.
      const hover = pointer.inside && hit(pointer.x, pointer.y)
      if (hover !== pointer.hover) {
        pointer.hover = hover
        el.style.cursor = hover ? "pointer" : ""
      }
    }

    const draw = () => {
      const gy = ground()
      const radius = r()
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      // Retícula que se apaga hacia arriba (tres bandas) y suelo en perspectiva con fuga en el centro.
      ctx.lineWidth = 1
      ctx.strokeStyle = COLORS.glow
      const cell = 36 * s
      for (let band = 0; band < 3; band++) {
        const top = (gy * band) / 3
        const bottom = (gy * (band + 1)) / 3
        ctx.globalAlpha = 0.05 + 0.08 * band
        ctx.beginPath()
        for (let x = (w / 2) % cell; x < w; x += cell) {
          ctx.moveTo(x, top)
          ctx.lineTo(x, bottom)
        }
        for (let y = gy - cell; y > top; y -= cell) {
          if (y > bottom) continue
          ctx.moveTo(0, y)
          ctx.lineTo(w, y)
        }
        ctx.stroke()
      }
      const vx = w / 2
      const vy = gy - 90 * s
      ctx.strokeStyle = COLORS.cyan
      ctx.globalAlpha = 0.22
      ctx.beginPath()
      const lane = 48 * s
      for (let x = vx - Math.ceil((vx * 3) / lane) * lane; x < w * 2.5; x += lane) {
        ctx.moveTo(vx + (x - vx) * ((gy - vy) / (h - vy)), gy)
        ctx.lineTo(x, h)
      }
      for (let k = 1; k <= 3; k++) {
        const y = gy + (h - gy) * (k / 3) ** 1.6
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
      }
      ctx.stroke()
      // Línea de suelo con halo.
      for (const [line, alpha] of [[7, 0.18], [1.5, 1]] as const) {
        ctx.globalAlpha = alpha
        ctx.lineWidth = line * s
        ctx.beginPath()
        ctx.moveTo(0, gy)
        ctx.lineTo(w, gy)
        ctx.stroke()
      }
      // Obstáculos: pinchos de tinta con borde magenta o cian y pads con chevrones que laten.
      obstacles.forEach((o, i) => {
        const neon = i % 2 ? COLORS.cyan : COLORS.magenta
        ctx.strokeStyle = neon
        ctx.fillStyle = COLORS.ink
        ctx.beginPath()
        if (o.count) {
          const size = SIZE.spike * s
          for (let k = 0; k < o.count; k++) {
            const x = o.x + k * size
            ctx.moveTo(x, gy)
            ctx.lineTo(x + size / 2, gy - size)
            ctx.lineTo(x + size, gy)
            ctx.closePath()
          }
          ctx.globalAlpha = 1
          ctx.fill()
        } else {
          ctx.strokeStyle = COLORS.cyan
          ctx.fillStyle = COLORS.cyan
          const pw = width(o)
          ctx.globalAlpha = 0.35 + 0.65 * o.flash
          ctx.fillRect(o.x, gy - 4 * s, pw, 4 * s)
          const beat = (Math.sin(time * 6 + i) + 1) / 2
          for (let k = 0; k < 2; k++) {
            const y = gy - (10 + k * 8) * s - beat * 3 * s
            ctx.moveTo(o.x + pw * 0.25, y + 5 * s)
            ctx.lineTo(o.x + pw / 2, y)
            ctx.lineTo(o.x + pw * 0.75, y + 5 * s)
          }
        }
        for (const [line, alpha] of [[6, 0.22], [1.6, 1]] as const) {
          ctx.globalAlpha = alpha * (o.count ? 1 : 0.6 + 0.4 * o.flash)
          ctx.lineWidth = line * s
          ctx.stroke()
        }
      })
      // Destellos de aterrizaje (elipse a ras de suelo) y ondas expansivas de la explosión.
      for (const ring of rings) {
        if (ring.age < 0) continue
        const k = ring.age / ring.ttl
        const size = ring.from + (ring.to - ring.from) * (1 - (1 - k) ** 3)
        ctx.globalAlpha = 0.9 * (1 - k)
        ctx.strokeStyle = ring.color
        ctx.lineWidth = Math.max(1, 3 * s * (1 - k))
        ctx.beginPath()
        if (ring.flat) ctx.ellipse(ring.x, ring.y, size, size * 0.2, 0, 0, TAU)
        else ctx.arc(ring.x, ring.y, size, 0, TAU)
        ctx.stroke()
      }
      // Partículas cuadradas, para que se lean como píxel.
      for (const bit of bits) {
        ctx.globalAlpha = 0.9 * (1 - bit.life / bit.ttl)
        ctx.fillStyle = bit.color
        ctx.fillRect(bit.x - bit.size / 2, bit.y - bit.size / 2, bit.size, bit.size)
      }
      // Logo: halo, imagen recortada en círculo y aro cian.
      if (player.phase === "run") {
        const [x, y] = center()
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(player.rot)
        ctx.globalAlpha = 0.3
        ctx.fillStyle = COLORS.cyan
        ctx.beginPath()
        ctx.arc(0, 0, radius + 5 * s, 0, TAU)
        ctx.fill()
        ctx.globalAlpha = 1
        ctx.beginPath()
        ctx.arc(0, 0, radius, 0, TAU)
        ctx.save()
        ctx.clip()
        if (ready) ctx.drawImage(logo, -radius, -radius, radius * 2, radius * 2)
        else {
          ctx.fillStyle = COLORS.cobalt
          ctx.fillRect(-radius, -radius, radius * 2, radius * 2)
        }
        ctx.restore()
        ctx.strokeStyle = COLORS.cyan
        ctx.lineWidth = 1.5 * s
        ctx.stroke()
        ctx.restore()
      }
      ctx.globalAlpha = 1
    }

    const resize = () => {
      const box = el.getBoundingClientRect()
      const wider = Math.abs(box.width - w) > 1
      w = box.width
      h = box.height
      s = h / 140
      speed = clamp(w / RUN.cross, RUN.speed)
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      // Sin bucle, el logo descansa sobre la pista antes del primer obstáculo.
      if (!animate) player.x = Math.max(SIZE.enter * s, w * 0.08)
      if (wider) layout()
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
    const local = (event: MouseEvent) => {
      const box = el.getBoundingClientRect()
      pointer.x = event.clientX - box.left
      pointer.y = event.clientY - box.top
    }
    const move = (event: PointerEvent) => {
      local(event)
      pointer.inside = true
    }
    const leave = () => {
      pointer.inside = false
    }
    const click = (event: MouseEvent) => {
      local(event)
      if (raf && hit(pointer.x, pointer.y)) explode()
    }

    logo.onload = () => {
      ready = true
      if (!raf) draw()
    }
    logo.src = LOGO
    spawn()
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      sync()
    })
    const ro = new ResizeObserver(resize)
    ro.observe(el)
    io.observe(el)
    document.addEventListener("visibilitychange", sync)
    if (animate) {
      el.addEventListener("pointermove", move, { passive: true })
      el.addEventListener("pointerleave", leave, { passive: true })
      el.addEventListener("click", click)
    }
    syncRef.current = sync
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      document.removeEventListener("visibilitychange", sync)
      el.removeEventListener("pointermove", move)
      el.removeEventListener("pointerleave", leave)
      el.removeEventListener("click", click)
      logo.onload = null
      syncRef.current = () => {}
    }
  }, [])

  return (
    <div ref={root} aria-hidden="true" className="runner relative w-full overflow-clip">
      <canvas className="pointer-events-none absolute inset-0 size-full" />
    </div>
  )
}
