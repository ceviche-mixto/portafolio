import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { MotionSwitcher } from "@/components/mode-switcher/MotionSwitcher"
import { translations } from "@/lib/i18n"
import { useMotionStore } from "@/store/useMotionStore"

afterEach(() => { cleanup(); useMotionStore.setState({ paused: false }); vi.restoreAllMocks() })
function system(reduced: boolean) {
  Object.defineProperty(window, "matchMedia", { configurable: true, value: () => ({ matches: reduced, addEventListener() {}, removeEventListener() {} }) })
}

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
