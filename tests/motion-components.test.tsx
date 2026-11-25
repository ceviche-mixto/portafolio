import { afterEach, describe, expect, it, vi } from "vitest"
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import axe from "axe-core"
import { HoverImageReveal } from "@/components/motion/HoverImageReveal"
import { MagneticField } from "@/components/motion/MagneticField"
import { ProceduralHeroBackdrop } from "@/components/motion/ProceduralHeroBackdrop"
import { Odometer } from "@/components/motion/Odometer"
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

  it("keeps the page in the DOM and offers an accessible skip", async () => {
    const { container } = render(<main><h1>Portafolio</h1><SplashLoader lang="en" /></main>)
    expect(screen.getByRole("heading", { name: "Portafolio" })).toBeTruthy()
    expect(screen.getByRole("button", { name: "Skip" })).toBeTruthy()
    expect(container.querySelector(".splash-bubble img")?.getAttribute("alt")).toBe("")
    const results = await axe.run(container)
    expect(results.violations.map((issue) => issue.id)).toEqual([])
  })

  it("plays once per session and closes on any key", () => {
    media()
    const { container } = render(<SplashLoader lang="es" />)
    run(container)
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
    const { container } = render(<SplashLoader lang="es" />)
    run(container)
    fireEvent.click(screen.getByRole("button", { name: "Saltar" }))
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
    const { container } = render(<SplashLoader lang="es" />)
    run(container)
    expect(document.documentElement.dataset.splash).toBeUndefined()
  })
})

describe("ProceduralHeroBackdrop", () => {
  /** Canvas 2D, observadores y rAF simulados: jsdom no los implementa. */
  function stage({ hidden = false } = {}) {
    const ctx = new Proxy({} as Record<string | symbol, unknown>, { get: (target, key) => (target[key] ??= vi.fn()) })
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(ctx as unknown as CanvasRenderingContext2D)
    const io = observer()
    vi.stubGlobal("ResizeObserver", class { constructor(private cb: () => void) {} observe() { this.cb() } disconnect() {} })
    const raf = vi.fn(() => 7)
    const cancel = vi.fn()
    vi.stubGlobal("requestAnimationFrame", raf)
    vi.stubGlobal("cancelAnimationFrame", cancel)
    let isHidden = hidden
    Object.defineProperty(document, "hidden", { configurable: true, get: () => isHidden })
    const hide = (value: boolean) => act(() => { isHidden = value; document.dispatchEvent(new Event("visibilitychange")) })
    return { ctx: ctx as Record<string, ReturnType<typeof vi.fn>>, io, raf, cancel, hide }
  }

  it("stays behind the content and offers an accessible pause", async () => {
    media()
    stage()
    const { container } = render(<ProceduralHeroBackdrop lang="es" />)
    expect(container.querySelector(".hb")?.getAttribute("aria-hidden")).toBe("true")
    const toggle = screen.getByRole("button", { name: "Pausar la animación del fondo" })
    expect(toggle.getAttribute("aria-pressed")).toBe("false")
    const results = await axe.run(container)
    expect(results.violations.map((issue) => issue.id)).toEqual([])
  })

  it("animates only while visible, in a visible tab and not paused", () => {
    media({ fine: true })
    const { io, raf, cancel, hide } = stage()
    const listen = vi.spyOn(window, "addEventListener")
    const { container } = render(<ProceduralHeroBackdrop lang="en" />)
    const root = container.querySelector<HTMLElement>(".hb")!
    expect(raf).not.toHaveBeenCalled()
    expect(listen.mock.calls.map(([type]) => type)).toContain("pointermove")
    io.enter()
    expect(raf).toHaveBeenCalledTimes(1)
    expect(root.dataset.paused).toBeUndefined()
    hide(true)
    expect(cancel).toHaveBeenCalledTimes(1)
    expect(root.dataset.paused).toBe("")
    hide(false)
    expect(raf).toHaveBeenCalledTimes(2)
    fireEvent.click(screen.getByRole("button", { name: "Pause the background animation" }))
    expect(cancel).toHaveBeenCalledTimes(2)
    expect(screen.getByRole("button", { pressed: true })).toBeTruthy()
  })

  it("drifts on its own on touch, without pointer listeners", () => {
    media({ fine: false })
    const { io, raf } = stage()
    const listen = vi.spyOn(window, "addEventListener")
    render(<ProceduralHeroBackdrop lang="es" />)
    io.enter()
    expect(raf).toHaveBeenCalledTimes(1)
    expect(listen.mock.calls.filter(([type]) => String(type).startsWith("pointer"))).toEqual([])
  })

  it("draws one still frame with reduced motion", () => {
    media({ reduce: true })
    const { ctx, io, raf } = stage()
    render(<ProceduralHeroBackdrop lang="es" />)
    io.enter()
    expect(raf).not.toHaveBeenCalled()
    expect(ctx.arc).toHaveBeenCalled()
  })
})
