import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react"
import axe from "axe-core"
import { CVSection } from "@/components/cv/CVSection"
import { ContactSection } from "@/features/contact/ContactSection"
import { HeroSection } from "@/features/hero/HeroSection"
import { SiteChrome } from "@/components/chrome/SiteChrome"
import { HomePage } from "@/components/site/HomePage"
import { LanguageSwitcher } from "@/components/mode-switcher/LanguageSwitcher"

vi.mock("@/components/motion/Reveal", () => ({ Reveal: ({ children }: { children: React.ReactNode }) => <div>{children}</div> }))
afterEach(() => { cleanup(); vi.unstubAllGlobals() })

const AXE_RULES = {
  "color-contrast": { enabled: false },
  // Regla experimental de axe: el nombre accesible debe contener el texto visible (WCAG 2.5.3).
  "label-content-name-mismatch": { enabled: true },
}

describe("CV integrity and actions", () => {
  it.each(["es", "en"] as const)("uses the matching PDF for preview and download in %s", (lang) => {
    render(<CVSection lang={lang} />)
    const view = screen.getByRole("link", { name: lang === "es" ? /Ver CV/ : /View CV/ })
    const download = screen.getByRole("link", { name: lang === "es" ? /Descargar CV/ : /Download CV/ })
    expect(view.getAttribute("href")).toBe(download.getAttribute("href"))
    expect(view.getAttribute("href")).toBe(`/cv/giancarlo-larios-cv-${lang}.pdf?v=20261023`)
    expect(view.getAttribute("target")).toBe("_blank")
    expect(view.getAttribute("rel")).toContain("noopener")
    expect(download.getAttribute("download")).toBe(`Giancarlo-Larios-CV-${lang.toUpperCase()}.pdf`)
    expect(screen.getByText(lang === "es" ? /PDF en español/ : /English PDF/)).toBeTruthy()
  })
  it.each(["es", "en"] as const)("links every CV preview to the page language in %s", (lang) => {
    render(<><HeroSection lang={lang} /><CVSection lang={lang} /></>)
    const previews = screen.getAllByRole("link", { name: lang === "es" ? /Ver CV/ : /View CV/ })
    expect(previews).toHaveLength(2)
    previews.forEach((link) => expect(link.getAttribute("href")).toBe(`/cv/giancarlo-larios-cv-${lang}.pdf?v=20261023`))
  })
  it("has no automatically detected structural violations", async () => {
    const { container } = render(<CVSection lang="es" />)
    const results = await axe.run(container, { rules: AXE_RULES })
    expect(results.violations.map((issue) => issue.id)).toEqual([])
  })
})

describe("language switch", () => {
  it.each([["es", "/en", "en", "EN"], ["en", "/", "es-PE", "ES"]] as const)(
    "links %s to the equivalent page with a name that starts with its visible text",
    (lang, href, target, visible) => {
      render(<LanguageSwitcher lang={lang} />)
      const link = screen.getByRole("link")
      expect(link.getAttribute("href")).toBe(href)
      expect(link.getAttribute("hreflang")).toBe(target)
      expect(link.getAttribute("lang")).toBe(target)
      expect(link.textContent?.startsWith(visible)).toBe(true)
      expect(link.getAttribute("aria-label")).toBeNull()
    }
  )
})

describe("public page accessibility", () => {
  it.each(["es", "en"] as const)("keeps complete readable structure in %s", async (lang) => {
    Object.defineProperty(window, "matchMedia", { configurable: true, value: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }) })
    vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} })
    const { container } = render(<><SiteChrome lang={lang} /><HomePage lang={lang} /></>)
    const results = await axe.run(container, { rules: AXE_RULES })
    expect(results.violations.map((issue) => ({ id: issue.id, elements: issue.nodes.map((node) => node.target) }))).toEqual([])
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1)
    expect(screen.getByRole("contentinfo")).toBeTruthy()
    const profile = container.querySelector("#perfil")?.textContent ?? ""
    expect(profile).not.toMatch(/estudiante|\bstudent\b|\bjunior\b|aprendiendo|learning to/i)
    expect(profile).toContain(lang === "es" ? "Desarrollador de software." : "Software developer.")
    expect(profile).not.toContain("Universidad Católica")
    expect(container.textContent).not.toMatch(/reclutador|recruiter/i)
  })
})

describe("contact recovery", () => {
  it("confirms a successful copy", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } })
    render(<ContactSection lang="es" />)
    fireEvent.click(screen.getByRole("button", { name: "Copiar" }))
    await screen.findByRole("button", { name: "Copiado" })
    expect(writeText).toHaveBeenCalledWith("giancarlolarios123@gmail.com")
  })
  it("gives an alternative when clipboard is denied", async () => {
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: vi.fn().mockRejectedValue(new Error("denied")) } })
    const { container } = render(<ContactSection lang="es" />)
    fireEvent.click(screen.getByRole("button", { name: "Copiar" }))
    await waitFor(() => expect(container.querySelector('[aria-live="polite"]')?.textContent).toContain("No se pudo copiar"))
    expect(screen.getByRole("link", { name: "giancarlolarios123@gmail.com" }).getAttribute("href")).toContain("mailto:")
  })
})
