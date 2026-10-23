import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { LanguageProvider } from "@/components/i18n/LanguageProvider"
import { MotionSwitcher } from "@/components/mode-switcher/MotionSwitcher"
import { useMotionStore } from "@/store/useMotionStore"
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion"
import { useRealMetrics } from "@/hooks/useRealMetrics"

afterEach(() => { cleanup(); useMotionStore.setState({ paused: false }); vi.restoreAllMocks() })
function system(reduced: boolean) {
  Object.defineProperty(window, "matchMedia", { configurable: true, value: () => ({ matches: reduced, addEventListener() {}, removeEventListener() {} }) })
}
function Controls({ lang = "es" }: { lang?: "es" | "en" }) {
  return <LanguageProvider initialLanguage={lang}><MotionSwitcher /></LanguageProvider>
}

describe("visitor motion control", () => {
  it.each(["es", "en"] as const)("pauses and resumes with a clear state in %s", (lang) => {
    system(false)
    render(<Controls lang={lang} />)
    const button = screen.getByRole("button", { name: lang === "es" ? "Reducir animaciones" : "Reduce animations" })
    expect(button.getAttribute("aria-pressed")).toBe("false")
    fireEvent.click(button)
    expect(button.getAttribute("aria-pressed")).toBe("true")
    expect(useMotionStore.getState().paused).toBe(true)
    expect(button.getAttribute("aria-label")).toBe(lang === "es" ? "Activar animaciones" : "Enable animations")
    fireEvent.click(button)
    expect(useMotionStore.getState().paused).toBe(false)
  })
  it("never overrides the system's reduced-motion setting", () => {
    system(true)
    render(<Controls />)
    const button = screen.getByRole("button", { name: "Movimiento reducido por tu sistema" })
    expect(button.hasAttribute("disabled")).toBe(true)
    expect(button.getAttribute("aria-pressed")).toBe("true")
    fireEvent.click(button)
    expect(useMotionStore.getState().paused).toBe(false)
  })
  it("stops optional performance sampling when motion is paused", () => {
    system(false)
    const request = vi.spyOn(window, "requestAnimationFrame")
    const cancel = vi.spyOn(window, "cancelAnimationFrame")
    function Monitor() {
      const reduced = usePrefersReducedMotion()
      useRealMetrics(!reduced)
      return <Controls />
    }
    render(<Monitor />)
    expect(request).toHaveBeenCalled()
    fireEvent.click(screen.getByRole("button", { name: "Reducir animaciones" }))
    expect(cancel).toHaveBeenCalled()
  })
})
