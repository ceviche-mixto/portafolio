import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"

const stats = vi.hoisted(() => ({ current: { reviews: null as number | null, professors: null as number | null, topProfessors: [], live: false } }))
vi.mock("@/lib/gradeo-stats", () => ({ getGradeoStats: async () => stats.current }))
import { GradeoLiveMetrics } from "@/components/case-study/GradeoLiveMetrics"

afterEach(cleanup)

describe("GRADEO metrics on the case page", () => {
  it.each(["es", "en"] as const)("falls back to the verified, dated count when production does not answer (%s)", async (lang) => {
    stats.current = { reviews: null, professors: null, topProfessors: [], live: false }
    render(await GradeoLiveMetrics({ lang }))
    expect(screen.getByText("919")).toBeTruthy()
    expect(screen.getByText("84")).toBeTruthy()
    expect(screen.getByText("24")).toBeTruthy()
    expect(screen.getByRole("heading").textContent).toBe(lang === "es" ? "Recuento verificado" : "Verified count")
    expect(document.body.textContent).toMatch(lang === "es" ? /18 de noviembre de 2026/ : /November 18, 2026/)
    expect(document.body.textContent).not.toMatch(/no disponible|unavailable/i)
  })

  it("shows the live reading when production answers, zero included", async () => {
    stats.current = { reviews: 0, professors: 920, topProfessors: [], live: true }
    render(await GradeoLiveMetrics({ lang: "es" }))
    expect(screen.getByRole("heading").textContent).toBe("Lectura en vivo")
    expect(screen.getByText("920")).toBeTruthy()
    expect(screen.getByText("0")).toBeTruthy()
  })
})
