import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react"
import axe from "axe-core"
import { TrajectorySection } from "@/features/trajectory/TrajectorySection"
import { ContactSection } from "@/features/contact/ContactSection"
import { SiteChrome } from "@/components/chrome/SiteChrome"
import { HomePage } from "@/components/site/HomePage"
import { CaseStudyArticle } from "@/components/case-study/CaseStudyArticle"
import { LanguageSwitcher } from "@/components/mode-switcher/LanguageSwitcher"
import { PROJECTS } from "@/content/projects"

const pathname = vi.hoisted(() => ({ current: "/" }))
vi.mock("next/navigation", () => ({ usePathname: () => pathname.current }))
afterEach(() => { cleanup(); vi.unstubAllGlobals(); pathname.current = "/" })

const AXE_RULES = {
  "color-contrast": { enabled: false },
  // WCAG 2.5.3. En jsdom axe la deja «incompleta»; ver el bloque dedicado más abajo.
  "label-content-name-mismatch": { enabled: true },
}

function browserStubs() {
  Object.defineProperty(window, "matchMedia", { configurable: true, value: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }) })
  vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} })
  vi.stubGlobal("IntersectionObserver", class { observe() {} disconnect() {} })
}

describe("CV integrity and actions", () => {
  it.each(["es", "en"] as const)("uses the matching PDF for preview and download in %s", (lang) => {
    render(<TrajectorySection lang={lang} />)
    const view = screen.getByRole("link", { name: lang === "es" ? /Ver CV/ : /View CV/ })
    const download = screen.getByRole("link", { name: lang === "es" ? /Descargar CV/ : /Download CV/ })
    expect(view.getAttribute("href")).toBe(download.getAttribute("href"))
    expect(view.getAttribute("href")).toBe(`/cv/giancarlo-larios-cv-${lang}.pdf?v=20261023`)
    expect(view.getAttribute("target")).toBe("_blank")
    expect(view.getAttribute("rel")).toContain("noopener")
    expect(download.getAttribute("download")).toBe(`Giancarlo-Larios-CV-${lang.toUpperCase()}.pdf`)
    expect(screen.getByText(lang === "es" ? /PDF en español/ : /English PDF/)).toBeTruthy()
  })
  it("has no automatically detected structural violations", async () => {
    const { container } = render(<TrajectorySection lang="es" />)
    const results = await axe.run(container, { rules: AXE_RULES })
    expect(results.violations.map((issue) => issue.id)).toEqual([])
  })
})

describe("language switch", () => {
  it.each([
    ["es", "/", "/en", "en", "EN"],
    ["en", "/en", "/", "es-PE", "ES"],
    ["es", "/proyectos/onectrl", "/en/projects/onectrl", "en", "EN"],
    ["en", "/en/projects/farmaplus", "/proyectos/farmaplus", "es-PE", "ES"],
  ] as const)("links %s %s to %s with a name that starts with its visible text", (lang, from, href, target, visible) => {
    pathname.current = from
    render(<LanguageSwitcher lang={lang} label={visible} name="x" />)
    const link = screen.getByRole("link")
    expect(link.getAttribute("href")).toBe(href)
    expect(link.getAttribute("hreflang")).toBe(target)
    expect(link.textContent?.startsWith(visible)).toBe(true)
    expect(link.getAttribute("aria-label")).toBeNull()
  })
})

/**
 * WCAG 2.5.3: el nombre accesible de un control contiene su texto visible.
 * La regla de axe (`label-content-name-mismatch`) necesita layout real y en
 * jsdom queda «incompleta», así que aquí se comprueba directamente y en Chrome
 * se ejecuta axe sobre el build de producción.
 */
describe("WCAG 2.5.3 label in name", () => {
  const visibleText = (el: Element) => {
    const clone = el.cloneNode(true) as Element
    clone.querySelectorAll('[aria-hidden="true"], .sr-only').forEach((node) => node.remove())
    return (clone.textContent ?? "").replace(/\s+/g, " ").trim()
  }
  const mismatches = (root: HTMLElement) =>
    [...root.querySelectorAll("a[href], button, summary")].flatMap((el) => {
      const visible = visibleText(el)
      const label = el.getAttribute("aria-label")
      return visible && label && !label.toLowerCase().includes(visible.toLowerCase()) ? [`${visible} → ${label}`] : []
    })

  it("flags a control whose name drops its visible text", () => {
    const { container } = render(<a href="/en" aria-label="Cambiar idioma">EN</a>)
    expect(mismatches(container)).toEqual(["EN → Cambiar idioma"])
  })

  it.each(["es", "en"] as const)("holds for every control on the home page and the case studies in %s", (lang) => {
    browserStubs()
    const { container } = render(
      <>
        <SiteChrome lang={lang} />
        <HomePage lang={lang} />
        {PROJECTS.map((project) => <CaseStudyArticle key={project.slug} project={project} lang={lang} />)}
      </>
    )
    expect(container.querySelectorAll("a[href], button, summary").length).toBeGreaterThan(40)
    expect(mismatches(container)).toEqual([])
  })
})

describe("public page accessibility", () => {
  it.each(["es", "en"] as const)("keeps the home page complete and readable in %s", async (lang) => {
    browserStubs()
    const { container } = render(<><SiteChrome lang={lang} /><HomePage lang={lang} /></>)
    const results = await axe.run(container, { rules: AXE_RULES })
    expect(results.violations.map((issue) => ({ id: issue.id, elements: issue.nodes.map((node) => node.target) }))).toEqual([])
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1)
    expect(screen.getByRole("contentinfo")).toBeTruthy()
    // Orden del recorrido y anclas heredadas.
    const ids = [...container.querySelectorAll("main > section[id]")].map((section) => section.id)
    expect(ids).toEqual(["proyectos", "ingenieria", "perfil", "contacto"])
    expect(container.querySelector("#gradeo")).toBeTruthy()
    const text = container.textContent ?? ""
    expect(text).not.toMatch(/\bjunior\b|estudiante|aprendiendo|learning to|reclutador|recruiter|vexo/i)
    PROJECTS.forEach((project) => expect(text).toContain(project.name))
  })

  it.each(PROJECTS.flatMap((project) => (["es", "en"] as const).map((lang) => [project.slug, lang, project] as const)))(
    "renders the %s case study in %s with its anchors and no detected violations",
    async (_, lang, project) => {
      const { container } = render(<main><CaseStudyArticle project={project} lang={lang} /></main>)
      const results = await axe.run(container, { rules: { ...AXE_RULES, region: { enabled: false } } })
      expect(results.violations.map((issue) => issue.id)).toEqual([])
      expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1)
      for (const id of ["resultado", "responsabilidad", "restriccion", "arquitectura", "decisiones", "resultados", ...project.decisions.map((d) => d.id)]) {
        expect(container.querySelector(`#${id}`), id).toBeTruthy()
      }
      expect(container.textContent).not.toMatch(/\bjunior\b|estudiante|vexo/i)
    }
  )
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
