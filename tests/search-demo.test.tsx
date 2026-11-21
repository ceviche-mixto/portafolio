import { afterEach, describe, expect, it, vi } from "vitest"
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import axe from "axe-core"
import { SearchDemo } from "@/components/case-study/SearchDemo"
import { translations } from "@/lib/i18n"

afterEach(() => { cleanup(); vi.useRealTimers() })

describe("GRADEO search demo", () => {
  it.each(["es", "en"] as const)("renders a result from the server HTML and stays accessible in %s", async (lang) => {
    const { container } = render(<SearchDemo lang={lang} copy={translations[lang].caseStudy.demo} />)
    expect(screen.getByRole("searchbox").getAttribute("id")).toBe("demo-busqueda")
    expect(screen.getAllByRole("listitem")[0].textContent).toContain("Lucía Morales")
    expect(container.querySelectorAll("mark").length).toBeGreaterThan(0)
    expect(screen.getByText(translations[lang].caseStudy.demo.disclaimer)).toBeTruthy()
    const results = await axe.run(container, { rules: { "color-contrast": { enabled: false } } })
    expect(results.violations.map((issue) => issue.id)).toEqual([])
  })

  it("reorders by similarity and announces only once typing stops", () => {
    vi.useFakeTimers()
    Object.defineProperty(window, "matchMedia", { configurable: true, value: () => ({ matches: true }) })
    render(<SearchDemo lang="es" copy={translations.es.caseStudy.demo} />)
    const status = screen.getByRole("status")
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "Rosa" } })
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "Rosa Q" } })
    expect(status.textContent).toBe("")
    act(() => vi.advanceTimersByTime(500))
    expect(status.textContent).toMatch(/^Resultados: \d\. Primero: Rosa Quispe, similitud 0,\d\d\.$/)
    fireEvent.click(screen.getByRole("button", { name: "Con tilde" }))
    expect(screen.getAllByRole("listitem")[0].textContent).toContain("Lucía Morales")
    expect(screen.getAllByRole("listitem").length).toBeLessThanOrEqual(3)
  })
})
