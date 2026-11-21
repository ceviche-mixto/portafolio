import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanup, render } from "@testing-library/react"
import axe from "axe-core"
import { CaseStudyArticle } from "@/components/case-study/CaseStudyArticle"
import { importPanels } from "@/components/case-study/ImportFigure"
import { getProject } from "@/content/projects"

afterEach(() => { cleanup(); vi.unstubAllGlobals() })

describe("architecture flow", () => {
  it.each(["es", "en"] as const)("gives OneCtrl one state panel per step and a hidden visual copy in %s", async (lang) => {
    const observe = vi.fn()
    vi.stubGlobal("IntersectionObserver", class { observe = observe; disconnect() {} })
    const project = getProject("onectrl")!
    const { container } = render(<main><CaseStudyArticle project={project} lang={lang} stepPanels={importPanels(lang)} /></main>)
    const section = container.querySelector("#arquitectura") as HTMLElement
    expect(section.dataset.step).toBe("1")
    expect(section.querySelectorAll("li[data-step-index]")).toHaveLength(4)
    expect(section.querySelectorAll(".step-panel-inline")).toHaveLength(4)
    expect(section.querySelector(".step-figure")?.getAttribute("aria-hidden")).toBe("true")
    expect(observe).toHaveBeenCalledTimes(4)
    const results = await axe.run(container, { rules: { "color-contrast": { enabled: false }, region: { enabled: false } } })
    expect(results.violations.map((issue) => issue.id)).toEqual([])
  })

  it("keeps the other cases without panels or observer", () => {
    const { container } = render(<CaseStudyArticle project={getProject("gradeo")!} lang="es" />)
    const section = container.querySelector("#arquitectura") as HTMLElement
    expect(section.dataset.step).toBeUndefined()
    expect(section.querySelector(".step-figure")).toBeNull()
    expect(section.querySelectorAll(".arch-fill")).toHaveLength(4)
  })
})
