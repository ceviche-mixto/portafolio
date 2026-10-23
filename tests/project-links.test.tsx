import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import axe from "axe-core"
import { ProjectLinks } from "@/components/project/ProjectLinks"
import { LanguageProvider } from "@/components/i18n/LanguageProvider"
import { translations, type Language } from "@/lib/i18n"
import { IDENTITY } from "@/lib/site"

afterEach(() => { cleanup(); vi.restoreAllMocks() })

function example(lang: Language = "es", projectName = "GRADEO", repo: string | null = null) {
  const t = translations[lang]
  return render(<LanguageProvider initialLanguage={lang}><ProjectLinks
    repo={repo} demo={null} projectName={projectName} codeOnRequest
    onRequestLabel={t.projects.codeOnRequest} liveLabel={t.gradeo.viewLive}
    codeLabel={t.gradeo.viewCode} newTabHint={t.nav.newTab}
  /></LanguageProvider>)
}

describe("private code contact disclosure", () => {
  it.each(["es", "en"] as const)("reveals an inline contact path without opening a tab in %s", (lang) => {
    const t = translations[lang]
    const { container } = example(lang)
    const summary = screen.getByText(t.projects.codeOnRequest)
    expect(summary.tagName).toBe("SUMMARY")
    expect(summary.getAttribute("aria-label")).toContain("GRADEO")
    fireEvent.click(summary)
    expect(container.querySelector("details")?.open).toBe(true)
    expect(screen.getByText(IDENTITY.email)).toBeTruthy()
    expect(screen.getByText(t.projects.codeRequest.description.replace("{project}", "GRADEO"))).toBeTruthy()
    const compose = screen.getByRole("link", { name: t.projects.codeRequest.compose })
    expect(compose.getAttribute("target")).toBeNull()
    const href = new URL(compose.getAttribute("href")!)
    expect(href.protocol).toBe("mailto:")
    expect(href.pathname).toBe(IDENTITY.email)
    expect(href.searchParams.get("subject")).toBe(`${t.projects.codeRequest.subject}: GRADEO`)
    expect(href.searchParams.get("body")).toContain("GRADEO")
    fireEvent.click(summary)
    expect(container.querySelector("details")?.open).toBe(false)
  })

  it.each(["es", "en"] as const)("confirms copying the email address in %s", async (lang) => {
    const t = translations[lang]
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } })
    example(lang, "FARMAPLUS")
    fireEvent.click(screen.getByText(t.projects.codeOnRequest))
    fireEvent.click(screen.getByRole("button", { name: t.projects.codeRequest.copyEmail }))
    await screen.findByRole("button", { name: t.projects.codeRequest.copied })
    expect(writeText).toHaveBeenCalledWith(IDENTITY.email)
    expect(screen.getByRole("status").textContent).toBe(t.projects.codeRequest.copied)
  })

  it("keeps a selectable address and instructions when clipboard permission is denied", async () => {
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: vi.fn().mockRejectedValue(new Error("denied")) } })
    example()
    fireEvent.click(screen.getByText("Solicitar código"))
    fireEvent.click(screen.getByRole("button", { name: "Copiar correo" }))
    await screen.findByText(translations.es.projects.codeRequest.copyFailed)
    expect(screen.getByText(IDENTITY.email)).toBeTruthy()
    expect(screen.getByRole("link", { name: "Redactar correo" })).toBeTruthy()
  })

  it("keeps real public repository links instead of offering a private-code request", () => {
    const { container } = example("en", "Project", "https://github.com/ceviche-mixto/portafolio")
    expect(container.querySelector("details")).toBeNull()
    expect(screen.getByRole("link", { name: /Code/ }).getAttribute("target")).toBe("_blank")
  })

  it.each(["es", "en"] as const)("has no detected structural accessibility violations when open in %s", async (lang) => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null)
    const { container } = example(lang)
    fireEvent.click(screen.getByText(translations[lang].projects.codeOnRequest))
    const results = await axe.run(container, { rules: { "color-contrast": { enabled: false }, region: { enabled: false } } })
    expect(results.violations.map((issue) => issue.id)).toEqual([])
  })
})
