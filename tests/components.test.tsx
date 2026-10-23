import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react"
import axe from "axe-core"
import { LanguageProvider } from "@/components/i18n/LanguageProvider"
import { CVSection } from "@/components/cv/CVSection"
import { ContactSection } from "@/features/contact/ContactSection"
import { ModeSwitcher } from "@/components/mode-switcher/ModeSwitcher"
import { useModeStore } from "@/store/useModeStore"
import { HeroSection } from "@/features/hero/HeroSection"
import { GradeoSection } from "@/features/gradeo/GradeoSection"
import { ProjectsSection } from "@/features/projects/ProjectsSection"
import { SiteFooter } from "@/features/contact/SiteFooter"
import { SiteNav } from "@/components/chrome/SiteNav"
import { LanguageSwitcher } from "@/components/mode-switcher/LanguageSwitcher"

vi.mock("@/components/motion/Reveal", () => ({ Reveal: ({ children }: { children: React.ReactNode }) => <div>{children}</div> }))
vi.mock("@/components/3d/HeroBackground", () => ({ HeroBackground: () => null }))
afterEach(() => { cleanup(); useModeStore.setState({ isDeveloperMode: false }); vi.unstubAllGlobals() })
function wrap(node: React.ReactNode, lang: "es" | "en" = "es") {
  return render(<LanguageProvider initialLanguage={lang}>{node}</LanguageProvider>)
}

describe("CV integrity and actions", () => {
  it.each(["es", "en"] as const)("uses the matching PDF for preview and download in %s", (lang) => {
    wrap(<CVSection />, lang)
    const view = screen.getByRole("link", { name: lang === "es" ? /Ver CV/ : /View CV/ })
    const download = screen.getByRole("link", { name: lang === "es" ? /Descargar CV/ : /Download CV/ })
    expect(view.getAttribute("href")).toBe(download.getAttribute("href"))
    expect(view.getAttribute("href")).toBe(`/cv/giancarlo-larios-cv-${lang}.pdf?v=20261023`)
    expect(view.getAttribute("target")).toBe("_blank")
    expect(view.getAttribute("rel")).toContain("noopener")
    expect(download.getAttribute("download")).toBe(`Giancarlo-Larios-CV-${lang.toUpperCase()}.pdf`)
    expect(screen.getByText(lang === "es" ? /PDF en español/ : /English PDF/)).toBeTruthy()
  })
  it("switches every CV link with the page language and back", () => {
    wrap(<><LanguageSwitcher /><HeroSection /><CVSection /></>)
    const assertCvLinks = (lang: "es" | "en") => {
      const previewName = lang === "es" ? /Ver CV/ : /View CV/
      const previews = screen.getAllByRole("link", { name: previewName })
      expect(previews).toHaveLength(2)
      previews.forEach((link) => expect(link.getAttribute("href")).toBe(`/cv/giancarlo-larios-cv-${lang}.pdf?v=20261023`))
      expect(screen.getByRole("link", { name: lang === "es" ? /Descargar CV/ : /Download CV/ }).getAttribute("href")).toBe(`/cv/giancarlo-larios-cv-${lang}.pdf?v=20261023`)
    }
    assertCvLinks("es")
    fireEvent.click(screen.getByRole("button", { name: "Switch to English" }))
    assertCvLinks("en")
    fireEvent.click(screen.getByRole("button", { name: "Cambiar a español" }))
    assertCvLinks("es")
  })
  it("has no automatically detected structural violations", async () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null)
    const { container } = wrap(<CVSection />)
    const results = await axe.run(container, { rules: { "color-contrast": { enabled: false } } })
    expect(results.violations.map((issue) => issue.id)).toEqual([])
  })
})

describe("public page accessibility", () => {
  it.each(["es", "en"] as const)("keeps complete readable structure with unavailable data in %s", async (lang) => {
    Object.defineProperty(window, "matchMedia", { configurable: true, value: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }) })
    vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} })
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null)
    const { container } = wrap(<><SiteNav /><main><HeroSection /><CVSection /><GradeoSection stats={{ professors: null, reviews: null, topProfessors: [], live: false }} /><ProjectsSection /><ContactSection /></main><SiteFooter /></>, lang)
    const results = await axe.run(container, { rules: { "color-contrast": { enabled: false } } })
    expect(results.violations.map((issue) => ({ id: issue.id, elements: issue.nodes.map((node) => node.target) }))).toEqual([])
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1)
    expect(screen.getByRole("contentinfo")).toBeTruthy()
    expect(container.querySelector("#automation-title")).toBeNull()
    const profile = container.querySelector("#perfil")?.textContent ?? ""
    expect(profile).not.toMatch(/estudiante|\bstudent\b|\bjunior\b|aprendiendo|learning to/i)
    expect(profile).toContain(lang === "es" ? "Desarrollador de software." : "Software developer.")
    expect(profile).not.toContain("Universidad Católica")
  })
})

describe("contact recovery", () => {
  it("confirms a successful copy", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } })
    wrap(<ContactSection />)
    fireEvent.click(screen.getByRole("button", { name: "Copiar" }))
    await screen.findByRole("button", { name: "Copiado" })
    expect(writeText).toHaveBeenCalledWith("giancarlolarios123@gmail.com")
  })
  it("gives an alternative when clipboard is denied", async () => {
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: vi.fn().mockRejectedValue(new Error("denied")) } })
    const { container } = wrap(<ContactSection />)
    fireEvent.click(screen.getByRole("button", { name: "Copiar" }))
    await waitFor(() => expect(container.querySelector('[aria-live="polite"]')?.textContent).toContain("No se pudo copiar"))
    expect(screen.getByRole("link", { name: "giancarlolarios123@gmail.com" }).getAttribute("href")).toContain("mailto:")
  })
  it("communicates the current view", () => {
    wrap(<ModeSwitcher />)
    const button = screen.getByRole("button", { name: "Cambiar a vista de desarrollador" })
    expect(button.getAttribute("aria-pressed")).toBe("false")
    fireEvent.click(button)
    expect(button.getAttribute("aria-pressed")).toBe("true")
  })
})
