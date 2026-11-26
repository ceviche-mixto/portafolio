import { afterEach, describe, expect, it, vi } from "vitest"
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import axe from "axe-core"
import { HoverImageReveal } from "@/components/motion/HoverImageReveal"
import { MagneticField } from "@/components/motion/MagneticField"
import { GlobalProceduralBackdrop } from "@/components/motion/GlobalProceduralBackdrop"
import { LogoRunner } from "@/components/motion/LogoRunner"
import { setMotionPaused } from "@/components/motion/motion-pause"
import { Odometer } from "@/components/motion/Odometer"
import { PixelText } from "@/components/motion/PixelText"
import { SplashLoader } from "@/components/motion/SplashLoader"
import { SplitText } from "@/components/motion/SplitText"
import { CopyEmailButton } from "@/components/ui/CopyEmailButton"

/** `matchMedia` que responde según la consulta: movimiento reducido y/o puntero fino. */
function media({ reduce = false, fine = false } = {}) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: (query: string) => ({
      // Las consultas combinadas («puntero fino and sin reducir») exigen las dos partes.
      matches: (!query.includes("no-preference") || !reduce) && (!query.includes("pointer: fine") || fine),
      addEventListener() {},
      removeEventListener() {},
    }),
  })
}

/** IntersectionObserver controlado: `enter()` simula la entrada en pantalla. */
function observer() {
  const callbacks: IntersectionObserverCallback[] = []
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: IntersectionObserverCallback) { callbacks.push(callback) }
      observe() {}
      disconnect() {}
    }
  )
  return { enter: () => act(() => callbacks.forEach((cb) => cb([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver))) }
}

/** WAAPI simulada sobre `Element.prototype`; jsdom no la implementa. */
function waapi() {
  const handles: { pause: ReturnType<typeof vi.fn>; play: ReturnType<typeof vi.fn>; cancel: ReturnType<typeof vi.fn> }[] = []
  const animate = vi.fn(() => {
    const handle = { pause: vi.fn(), play: vi.fn(), cancel: vi.fn(), finished: Promise.resolve() }
    handles.push(handle)
    return handle
  })
  Object.defineProperty(Element.prototype, "animate", { configurable: true, writable: true, value: animate })
  return { animate, handles }
}

afterEach(() => {
  cleanup()
  act(() => setMotionPaused(false))
  vi.unstubAllGlobals()
  delete (Element.prototype as { animate?: unknown }).animate
})

describe("SplitText", () => {
  const TEXT = "Construyo software que llega a producción."

  it("reads as one phrase and staggers every visible character", async () => {
    media()
    const { container } = render(<h1><SplitText text={TEXT} trigger="load" /></h1>)
    expect(screen.getByRole("heading", { level: 1, name: TEXT })).toBeTruthy()
    expect(container.querySelector(".sr-only")?.textContent).toBe(TEXT)
    const chars = [...container.querySelectorAll<HTMLElement>(".split-char")]
    expect(chars.every((char) => char.closest('[aria-hidden="true"]'))).toBe(true)
    expect(chars.map((char) => char.textContent).join("")).toBe(TEXT.replaceAll(" ", ""))
    expect(chars.map((char) => char.style.getPropertyValue("--i"))).toEqual(chars.map((_, i) => String(i)))
    // Una máscara por palabra; el espacio queda entre palabras para que el texto pueda partir línea.
    expect(container.querySelectorAll(".split-word")).toHaveLength(TEXT.split(" ").length)
    expect(container.querySelector(".split")?.classList.contains("split-load")).toBe(true)
    const results = await axe.run(container)
    expect(results.violations.map((issue) => issue.id)).toEqual([])
  })

  it("arms below the fold and plays once it enters the viewport", () => {
    media()
    const io = observer()
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ top: 5000 } as DOMRect)
    const { container } = render(<h2><SplitText text="Enfoque de ingeniería" /></h2>)
    const root = container.querySelector<HTMLElement>(".split")!
    expect(root.dataset.split).toBe("armed")
    io.enter()
    expect(root.dataset.split).toBe("play")
  })

  it("stays still when it is already on screen or motion is reduced", () => {
    media()
    observer()
    const onScreen = render(<h2><SplitText text="Trayectoria" /></h2>)
    expect(onScreen.container.querySelector<HTMLElement>(".split")!.dataset.split).toBeUndefined()
    cleanup()

    media({ reduce: true })
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ top: 5000 } as DOMRect)
    const reduced = render(<h2><SplitText text="Trayectoria" /></h2>)
    expect(reduced.container.querySelector<HTMLElement>(".split")!.dataset.split).toBeUndefined()
  })
})

describe("Odometer", () => {
  it("ships the final value in the HTML with one reel per digit", () => {
    media()
    const { container } = render(<p><Odometer value={919} locale="es-PE" /></p>)
    expect(screen.getByText("919").classList.contains("sr-only")).toBe(true)
    const reels = [...container.querySelectorAll<HTMLElement>(".odometer-reel")]
    expect(reels.map((reel) => reel.style.getPropertyValue("--d"))).toEqual(["9", "1", "9"])
    expect(reels.every((reel) => reel.closest('[aria-hidden="true"]'))).toBe(true)
    // Cifras tabulares: el ancho no cambia mientras ruedan.
    expect(container.querySelector(".odometer")).toBeTruthy()
  })

  it("keeps separators and formats by locale", () => {
    media()
    const { container } = render(<p><Odometer value={1234} locale="en-US" /></p>)
    expect(screen.getByText("1,234")).toBeTruthy()
    expect(container.querySelectorAll(".odometer-reel")).toHaveLength(4)
  })

  it("rolls each reel from 0 to its digit once, on entering the viewport", () => {
    media()
    const io = observer()
    const { animate, handles } = waapi()
    render(<p><Odometer value={84} locale="es-PE" /></p>)
    expect(animate).toHaveBeenCalledTimes(2)
    expect(animate.mock.calls.map((call) => (call as unknown as [Keyframe[]])[0].map((frame) => frame.transform))).toEqual([
      ["translate3d(0, 0, 0)", "translate3d(0, -80%, 0)"],
      ["translate3d(0, 0, 0)", "translate3d(0, -40%, 0)"],
    ])
    expect(handles.every((handle) => handle.pause.mock.calls.length === 1 && handle.play.mock.calls.length === 0)).toBe(true)
    io.enter()
    expect(handles.every((handle) => handle.play.mock.calls.length === 1)).toBe(true)
  })

  it("does not animate with reduced motion: the final value is already in place", () => {
    media({ reduce: true })
    observer()
    const { animate } = waapi()
    render(<p><Odometer value={24} locale="es-PE" /></p>)
    expect(animate).not.toHaveBeenCalled()
    expect(screen.getByText("24")).toBeTruthy()
  })
})

describe("pointer-only effects", () => {
  // React delega sus eventos en el contenedor raíz y en el del portal: aquí sólo cuentan los del componente.
  const own = (listen: { mock: { calls: unknown[][]; contexts: unknown[] } }, root: Element) =>
    listen.mock.calls
      .filter((call, i) => String(call[0]).startsWith("pointer") && ![root, document.body].includes(listen.mock.contexts[i] as Element))
      .map((call) => call[0])

  it("adds no pointer listeners on touch devices", () => {
    media({ fine: false })
    const listen = vi.spyOn(HTMLElement.prototype, "addEventListener")
    const global = vi.spyOn(document, "addEventListener")
    const { container } = render(
      <>
        <MagneticField />
        <a href="#proyectos" className="tactile"><span>Ver proyectos</span></a>
        <HoverImageReveal image={{ src: "/images/projects/farmaplus-pos.png", width: 1600, height: 1000 }}><p>Farmaplus</p></HoverImageReveal>
      </>
    )
    expect(own(listen, container)).toEqual([])
    expect(global.mock.calls.filter(([type]) => type.startsWith("pointer"))).toEqual([])
    expect(document.querySelector(".hover-reveal")).toBeNull()
  })

  it("follows a fine pointer and mounts the floating preview", () => {
    media({ fine: true })
    const listen = vi.spyOn(HTMLElement.prototype, "addEventListener")
    const { container } = render(
      <HoverImageReveal image={{ src: "/images/projects/farmaplus-pos.png", width: 1600, height: 1000 }}><p>Farmaplus</p></HoverImageReveal>
    )
    expect(own(listen, container).filter((type) => type === "pointermove")).toHaveLength(1)
    expect(document.querySelector('.hover-reveal[aria-hidden="true"]')).toBeTruthy()
  })

  it("pulls any tactile button toward the pointer and releases it on leave", () => {
    media({ fine: true })
    render(
      <>
        <MagneticField />
        <button type="button" className="tactile"><span>Reintentar</span></button>
      </>
    )
    const button = screen.getByRole("button", { name: "Reintentar" })
    vi.spyOn(button, "getBoundingClientRect").mockReturnValue({ left: 0, top: 0, width: 100, height: 40 } as DOMRect)
    fireEvent.pointerOver(button.firstChild as Element)
    // Esquina inferior derecha y más allá: el tirón se limita a ±8 px.
    fireEvent.pointerMove(button, { clientX: 100, clientY: 400 })
    expect(button.dataset.magnet).toBe("")
    expect([button.style.getPropertyValue("--mx"), button.style.getPropertyValue("--my")]).toEqual(["8.0px", "8.0px"])
    // Pasar a un hijo no lo suelta; salir del botón sí.
    fireEvent.pointerOut(button, { relatedTarget: button.firstChild })
    expect(button.dataset.magnet).toBe("")
    fireEvent.pointerOut(button, { relatedTarget: document.body })
    expect(button.dataset.magnet).toBeUndefined()
    expect(button.style.getPropertyValue("--mx")).toBe("")
  })
})

describe("copy celebration", () => {
  it("shows the elastic pill outside the accessible name and announces once", async () => {
    media()
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: vi.fn().mockResolvedValue(undefined) } })
    render(<CopyEmailButton email="a@b.c" labels={{ idle: "Copiar", copied: "Copiado", failed: "No se pudo", pill: "¡Copiado!" }} />)
    fireEvent.click(screen.getByRole("button", { name: "Copiar" }))
    await screen.findByRole("button", { name: "Copiado" })
    const pill = screen.getByText("¡Copiado!")
    expect(pill.closest('[aria-hidden="true"]')).toBeTruthy()
    expect(screen.getByRole("status").textContent).toBe("Copiado")
  })
})

describe("SplashLoader", () => {
  /** Ejecuta el script en línea tal cual sale en el HTML. */
  const run = (container: HTMLElement) => new Function(container.querySelector("script")!.textContent!)()

  afterEach(() => {
    sessionStorage.clear()
    delete document.documentElement.dataset.splash
  })

  it("keeps the page in the DOM with no visible control of its own", async () => {
    const { container } = render(<main><h1>Portafolio</h1><SplashLoader /></main>)
    expect(screen.getByRole("heading", { name: "Portafolio" })).toBeTruthy()
    expect(screen.queryByRole("button")).toBeNull()
    expect(container.querySelector(".splash-bubble img")?.getAttribute("alt")).toBe("")
    const results = await axe.run(container)
    expect(results.violations.map((issue) => issue.id)).toEqual([])
  })

  it("plays once per session and closes on Escape, not on Tab", () => {
    media()
    const { container } = render(<SplashLoader />)
    run(container)
    expect(document.documentElement.dataset.splash).toBe("play")
    fireEvent.keyDown(document, { key: "Tab" })
    expect(document.documentElement.dataset.splash).toBe("play")
    fireEvent.keyDown(document, { key: "Escape" })
    expect(document.documentElement.dataset.splash).toBe("done")
    // Segunda carga en la misma sesión: no vuelve a reproducirse.
    delete document.documentElement.dataset.splash
    run(container)
    expect(document.documentElement.dataset.splash).toBeUndefined()
  })

  it("closes on click and when its own animation ends", () => {
    media()
    const { container } = render(<SplashLoader />)
    run(container)
    fireEvent.click(container.querySelector(".splash")!)
    expect(document.documentElement.dataset.splash).toBe("done")
    sessionStorage.clear()
    run(container)
    // El final de una animación interna no la retira; el de la capa sí.
    fireEvent.animationEnd(container.querySelector(".splash-logo")!)
    expect(document.documentElement.dataset.splash).toBe("play")
    fireEvent.animationEnd(container.querySelector(".splash")!)
    expect(document.documentElement.dataset.splash).toBe("done")
  })

  it("never plays with reduced motion", () => {
    media({ reduce: true })
    const { container } = render(<SplashLoader />)
    run(container)
    expect(document.documentElement.dataset.splash).toBeUndefined()
  })
})

describe("PixelText", () => {
  const TEXT = "Desarrollo software con obsesión por el detalle."

  it("reads as one phrase and staggers every visible character", async () => {
    const { container } = render(<h1><PixelText text={TEXT} /></h1>)
    expect(screen.getByRole("heading", { name: TEXT })).toBeTruthy()
    const chars = [...container.querySelectorAll<HTMLElement>(".px-char")]
    expect(chars.map((char) => char.textContent).join("")).toBe(TEXT.replace(/ /g, ""))
    expect(chars.map((char) => char.style.getPropertyValue("--i"))).toEqual(chars.map((_, i) => String(i)))
    expect(chars[0].closest('[aria-hidden="true"]')).toBeTruthy()
    const results = await axe.run(container)
    expect(results.violations.map((issue) => issue.id)).toEqual([])
  })
})

/** Canvas 2D, observadores y rAF simulados: jsdom no los implementa. `frames` guarda cada callback. */
function stage({ hidden = false } = {}) {
  const ctx = new Proxy({} as Record<string | symbol, unknown>, { get: (target, key) => (target[key] ??= vi.fn()) })
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(ctx as unknown as CanvasRenderingContext2D)
  const io = observer()
  vi.stubGlobal("ResizeObserver", class { constructor(private cb: () => void) {} observe() { this.cb() } disconnect() {} })
  const frames: FrameRequestCallback[] = []
  const raf = vi.fn((callback: FrameRequestCallback) => (frames.push(callback), 7))
  const cancel = vi.fn()
  vi.stubGlobal("requestAnimationFrame", raf)
  vi.stubGlobal("cancelAnimationFrame", cancel)
  let isHidden = hidden
  Object.defineProperty(document, "hidden", { configurable: true, get: () => isHidden })
  const hide = (value: boolean) => act(() => { isHidden = value; document.dispatchEvent(new Event("visibilitychange")) })
  /** Ejecuta el último fotograma pedido, 16 ms después de ahora. */
  const tick = () => act(() => frames.at(-1)?.(performance.now() + 16))
  return { ctx: ctx as Record<string, ReturnType<typeof vi.fn>>, io, raf, cancel, hide, tick }
}

describe("GlobalProceduralBackdrop", () => {
  it("stays fixed behind every section, hidden from assistive tech", async () => {
    media()
    stage()
    const { container } = render(<GlobalProceduralBackdrop />)
    const root = container.querySelector(".gb")!
    expect(root.getAttribute("aria-hidden")).toBe("true")
    expect([...root.classList]).toEqual(expect.arrayContaining(["fixed", "inset-0", "-z-10", "pointer-events-none"]))
    const results = await axe.run(container)
    expect(results.violations.map((issue) => issue.id)).toEqual([])
  })

  it("animates while the tab is visible and the shared pause is off", () => {
    media({ fine: true })
    const { raf, cancel, hide } = stage()
    const listen = vi.spyOn(window, "addEventListener")
    const { container } = render(<GlobalProceduralBackdrop />)
    const root = container.querySelector<HTMLElement>(".gb")!
    expect(raf).toHaveBeenCalledTimes(1)
    expect(listen.mock.calls.map(([type]) => type)).toContain("pointermove")
    hide(true)
    expect(cancel).toHaveBeenCalledTimes(1)
    expect(root.dataset.paused).toBe("")
    hide(false)
    expect(raf).toHaveBeenCalledTimes(2)
    act(() => setMotionPaused(true))
    expect(cancel).toHaveBeenCalledTimes(2)
    expect(root.dataset.paused).toBe("")
  })

  it("moves the grid with the page scroll, wrapping on its 160 px period", () => {
    media({ fine: true })
    const { tick } = stage()
    const { container } = render(<GlobalProceduralBackdrop />)
    Object.defineProperty(window, "scrollY", { configurable: true, value: 1400 })
    tick()
    // 1400 × 0,12 = 168 → 168 mod 160 = 8.
    expect(container.querySelector<HTMLElement>(".gb-grid")!.style.transform).toBe("translate3d(0.00px, -8.00px, 0)")
    Object.defineProperty(window, "scrollY", { configurable: true, value: 0 })
  })

  it("drifts on its own on touch, without pointer listeners", () => {
    media({ fine: false })
    const { raf } = stage()
    const listen = vi.spyOn(window, "addEventListener")
    render(<GlobalProceduralBackdrop />)
    expect(raf).toHaveBeenCalledTimes(1)
    expect(listen.mock.calls.filter(([type]) => String(type).startsWith("pointer"))).toEqual([])
  })

  it("draws one still frame with reduced motion", () => {
    media({ reduce: true })
    const { ctx, raf } = stage()
    render(<GlobalProceduralBackdrop />)
    expect(raf).not.toHaveBeenCalled()
    expect(ctx.arc).toHaveBeenCalled()
  })
})

describe("LogoRunner", () => {
  afterEach(() => vi.restoreAllMocks())

  /** Pista de 1280 × 140 px: jsdom no maqueta, así que se fija la caja. */
  function sized() {
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ left: 0, top: 0, width: 1280, height: 140, right: 1280, bottom: 140, x: 0, y: 0, toJSON() {} } as DOMRect)
  }
  /** Avanza `n` fotogramas de 50 ms (el tope de `dt`) sobre el último callback pedido. */
  function advance(raf: ReturnType<typeof vi.fn>, n: number) {
    for (let i = 0; i < n; i++) act(() => raf.mock.calls.at(-1)![0]((clock += 50)))
  }
  let clock = 0
  /** Posición del logo en el último fotograma: sólo él usa `translate`. */
  const logo = (ctx: Record<string, ReturnType<typeof vi.fn>>) => ctx.translate.mock.calls.at(-1) as [number, number]

  it("runs only on screen and under the shared pause, hidden from assistive tech", async () => {
    media()
    sized()
    const { io, raf, cancel } = stage()
    const { container } = render(<LogoRunner />)
    expect(container.querySelector(".runner")?.getAttribute("aria-hidden")).toBe("true")
    expect(screen.queryAllByRole("button")).toEqual([])
    expect(raf).not.toHaveBeenCalled()
    io.enter()
    expect(raf).toHaveBeenCalledTimes(1)
    act(() => setMotionPaused(true))
    expect(cancel).toHaveBeenCalledTimes(1)
    const results = await axe.run(container)
    expect(results.violations.map((issue) => issue.id)).toEqual([])
  })

  it("enters from off the left edge and jumps the spikes on its own", () => {
    media()
    sized()
    const { ctx, io, raf } = stage()
    render(<LogoRunner />)
    clock = performance.now()
    io.enter()
    advance(raf, 1)
    expect(logo(ctx)[0]).toBeLessThan(0)
    const heights = Array.from({ length: 80 }, () => (advance(raf, 1), logo(ctx)[1]))
    expect(Math.min(...heights)).toBeLessThan(Math.max(...heights))
    expect(ctx.rotate.mock.calls.some(([angle]) => angle > 0)).toBe(true)
  })

  it("explodes only when the logo itself is clicked, without cancelling the click, and comes back", () => {
    media()
    sized()
    const { ctx, io, raf, tick } = stage()
    const { container } = render(<LogoRunner />)
    const track = container.querySelector<HTMLElement>(".runner")!
    clock = performance.now()
    io.enter()
    advance(raf, 20)
    const [x, y] = logo(ctx)
    expect(fireEvent.click(track, { clientX: x + 200, clientY: y })).toBe(true)
    // `tick` llega con dt 0: el logo no se mueve y se comprueba el hitbox bajo el cursor.
    tick()
    expect(track.style.cursor).toBe("")
    fireEvent.pointerMove(track, { clientX: x, clientY: y })
    tick()
    expect(track.style.cursor).toBe("pointer")
    expect(fireEvent.click(track, { clientX: x, clientY: y })).toBe(true)
    const drawn = ctx.translate.mock.calls.length
    tick()
    expect(ctx.translate.mock.calls.length).toBe(drawn)
    expect(track.style.cursor).toBe("")
    // A los 1,8 s sale otro desde fuera del borde izquierdo.
    clock = performance.now() + 16
    advance(raf, 40)
    expect(ctx.translate.mock.calls.length).toBeGreaterThan(drawn)
    expect(logo(ctx)[0]).toBeLessThan(0)
  })

  it("rests on the track with reduced motion: no loop and no listeners", () => {
    media({ reduce: true })
    sized()
    const { ctx, io, raf } = stage()
    const listen = vi.spyOn(HTMLElement.prototype, "addEventListener")
    const { container } = render(<LogoRunner />)
    io.enter()
    expect(raf).not.toHaveBeenCalled()
    const track = container.querySelector(".runner")
    expect(listen.mock.contexts.filter((context) => context === track)).toEqual([])
    expect(logo(ctx)[0]).toBeGreaterThan(0)
  })
})
