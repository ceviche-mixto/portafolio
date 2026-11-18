import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { MotionSwitcher } from "@/components/mode-switcher/MotionSwitcher"
import { HeroParallax } from "@/components/motion/HeroParallax"
import { ListShift } from "@/components/motion/ListShift"
import { EmphasisLayer, EmphasisTrack, emphasisKeyframes } from "@/components/case-study/ArchitectureEmphasis"
import { translations } from "@/lib/i18n"
import { useMotionStore } from "@/store/useMotionStore"

// Motion se sustituye por un registro: lo que importa aquí es qué se enlaza al
// scroll, con qué valores, y que se suelte al pedir movimiento reducido.
const motion = vi.hoisted(() => ({
  animations: [] as { keyframes: Record<string, unknown[]>; options: Record<string, unknown>; cancel: () => void }[],
  links: [] as { offset: unknown; detach: () => void }[],
}))
vi.mock("framer-motion", () => ({
  animate: (_el: Element, keyframes: Record<string, unknown[]>, options: Record<string, unknown>) => {
    const animation = { keyframes, options, cancel: vi.fn() }
    motion.animations.push(animation)
    return animation
  },
  scroll: (_animation: unknown, options: { offset: unknown }) => {
    const link = { offset: options.offset, detach: vi.fn() }
    motion.links.push(link)
    return link.detach
  },
}))

beforeEach(() => { motion.animations.length = 0; motion.links.length = 0 })
afterEach(() => { cleanup(); useMotionStore.setState({ paused: false }); vi.restoreAllMocks() })
function system(reduced: boolean) {
  Object.defineProperty(window, "matchMedia", { configurable: true, value: () => ({ matches: reduced, addEventListener() {}, removeEventListener() {} }) })
}

/** Las tres islas de movimiento con contenido real dentro. */
function Islands() {
  return (
    <>
      <HeroParallax><p>captura</p></HeroParallax>
      <div><ListShift><p>tarjeta</p></ListShift></div>
      <EmphasisTrack steps={4}>
        <ol>{[0, 1, 2, 3].map((i) => <li key={i}><span data-node={i}><EmphasisLayer index={i} />{i + 1}</span></li>)}</ol>
      </EmphasisTrack>
    </>
  )
}

const inlineMotion = (root: HTMLElement) =>
  [...root.querySelectorAll<HTMLElement>("[style]")].filter((el) => /transform|opacity/.test(el.getAttribute("style") ?? ""))

describe("visitor motion control", () => {
  it.each(["es", "en"] as const)("pauses and resumes with a clear state in %s", (lang) => {
    system(false)
    render(<MotionSwitcher labels={translations[lang].motion} />)
    const button = screen.getByRole("button", { name: lang === "es" ? "Reducir animaciones" : "Reduce animations" })
    expect(button.getAttribute("aria-pressed")).toBe("false")
    fireEvent.click(button)
    expect(button.getAttribute("aria-pressed")).toBe("true")
    expect(useMotionStore.getState().paused).toBe(true)
    expect(document.documentElement.dataset.motion).toBe("reduced")
    expect(button.getAttribute("aria-label")).toBe(lang === "es" ? "Activar animaciones" : "Enable animations")
    fireEvent.click(button)
    expect(useMotionStore.getState().paused).toBe(false)
    expect(document.documentElement.dataset.motion).toBe("full")
  })
  it("never overrides the system's reduced-motion setting", () => {
    system(true)
    render(<MotionSwitcher labels={translations.es.motion} />)
    const button = screen.getByRole("button", { name: "Movimiento reducido por tu sistema" })
    expect(button.hasAttribute("disabled")).toBe(true)
    expect(button.getAttribute("aria-pressed")).toBe("true")
    fireEvent.click(button)
    expect(useMotionStore.getState().paused).toBe(false)
  })
})

describe("scroll choreography", () => {
  it("encodes max(0, 1 - |3p - i|) exactly as keyframes for every node", () => {
    // Interpolación lineal entre keyframes, como la hace el navegador.
    const sample = ({ times, values }: { times: number[]; values: number[] }, p: number) => {
      for (let k = 1; k < times.length; k++) {
        if (p <= times[k]) return values[k - 1] + ((p - times[k - 1]) / (times[k] - times[k - 1])) * (values[k] - values[k - 1])
      }
      return values[values.length - 1]
    }
    for (let i = 0; i < 4; i++) {
      const frames = emphasisKeyframes(i, 4)
      expect(frames.times[0]).toBe(0)
      expect(frames.times.at(-1)).toBe(1)
      for (let step = 0; step <= 20; step++) {
        const p = step / 20
        expect(sample(frames, p), `i=${i} p=${p}`).toBeCloseTo(Math.max(0, 1 - Math.abs(3 * p - i)), 6)
      }
    }
  })

  it("links the hero, the list image and the four nodes to the scroll", () => {
    system(false)
    render(<Islands />)
    // Hero: captura −24 px y guía 1 → 0 al salir; lista: 12 → 0 px al entrar; 4 realces.
    expect(motion.animations).toHaveLength(7)
    expect(motion.animations[0].keyframes).toEqual({ transform: ["translateY(0px)", "translateY(-24px)"] })
    expect(motion.animations[1].keyframes).toEqual({ opacity: [1, 0] })
    expect(motion.animations[2].keyframes).toEqual({ transform: ["translateY(12px)", "translateY(0px)"] })
    const exit = [[0, 0], [1, 0]]
    const enter = [[0, 1], [1, 1]]
    expect(motion.links.map((link) => link.offset)).toEqual([exit, exit, enter, enter, enter, enter, enter])
    motion.animations.forEach((animation) => expect(animation.options).toMatchObject({ duration: 1, ease: "linear" }))
  })

  it.each([
    ["the system asks for reduced motion", () => system(true)],
    ["the visitor pauses motion", () => { system(false); useMotionStore.setState({ paused: true }) }],
  ])("renders a static composition when %s", (_, setup) => {
    setup()
    const { container } = render(<Islands />)
    expect(motion.animations).toHaveLength(0)
    expect(inlineMotion(container)).toEqual([])
    // El contenido y los cuatro pasos siguen montados; sólo faltan las capas de realce.
    expect(screen.getByText("captura")).toBeTruthy()
    expect(screen.getByText("tarjeta")).toBeTruthy()
    expect(container.querySelectorAll("li")).toHaveLength(4)
    expect(container.querySelectorAll("[data-node] > span[aria-hidden]")).toHaveLength(0)
  })

  it("releases every scroll link when the visitor pauses after load", () => {
    system(false)
    render(<Islands />)
    act(() => useMotionStore.setState({ paused: true }))
    expect(motion.animations).toHaveLength(7)
    motion.animations.forEach((animation) => expect(animation.cancel).toHaveBeenCalled())
    motion.links.forEach((link) => expect(link.detach).toHaveBeenCalled())
  })
})
