import { describe, expect, it, vi } from "vitest"
import { activeSection } from "@/lib/navigation"
import { contentSecurityPolicy } from "@/lib/security"
import { withDeadline } from "@/lib/deadline"

describe("active navigation", () => {
  const sections = [{ id: "perfil", top: -600 }, { id: "gradeo", top: 100 }, { id: "proyectos", top: 1800 }, { id: "contacto", top: 2100 }]
  it("tracks the last section above the header", () => expect(activeSection(sections, 120, false)).toBe("gradeo"))
  it("handles the short last section at document bottom", () => expect(activeSection(sections, 120, true)).toBe("contacto"))
  it("leaves the hero without a false section", () => expect(activeSection([{ id: "perfil", top: 900 }], 120, false)).toBeNull())
  it("allows subpixel rounding at an anchor", () => expect(activeSection(sections, 99.6, false)).toBe("gradeo"))
  it("accepts empty and zoomed layouts", () => {
    expect(activeSection([], 320, true)).toBeNull()
    expect(activeSection(sections, 2000, false)).toBe("proyectos")
  })
})

describe("CSP", () => {
  it("requires a nonce and disallows inline/eval scripts in production", () => {
    const policy = contentSecurityPolicy("abc123==")
    expect(policy).toContain("script-src 'self' 'nonce-abc123==' 'strict-dynamic';")
    expect(policy).not.toContain("unsafe-eval")
    expect(policy.split(";").find((part) => part.includes("script-src"))).not.toContain("unsafe-inline")
    for (const directive of ["object-src", "frame-src", "frame-ancestors", "form-action", "base-uri"]) expect(policy).toContain(`${directive} 'none'`)
  })
  it("rejects header injection", () => expect(() => contentSecurityPolicy("evil'; script-src *")).toThrow())
  it("only allows eval while developing", () => expect(contentSecurityPolicy("abc", true)).toContain("unsafe-eval"))
})

describe("optional queries", () => {
  it("returns real data without waiting for the deadline", async () => expect(await withDeadline(async () => 42, 0, 100)).toBe(42))
  it("recovers from a failed query", async () => expect(await withDeadline(async () => { throw new Error("offline") }, 0, 100)).toBe(0))
  it("bounds a stalled query and aborts requests", async () => {
    vi.useFakeTimers()
    let aborted = false
    const result = withDeadline((signal) => {
      signal.addEventListener("abort", () => { aborted = true })
      return new Promise<number>(() => {})
    }, 0, 1800)
    await vi.advanceTimersByTimeAsync(1799)
    expect(aborted).toBe(false)
    await vi.advanceTimersByTimeAsync(1)
    expect(await result).toBe(0)
    expect(aborted).toBe(true)
    vi.useRealTimers()
  })
})
