import { beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({ getSupabase: vi.fn() }))
vi.mock("@/lib/supabase", () => ({ getSupabase: mocks.getSupabase }))
vi.mock("next/cache", () => ({ unstable_cache: (read: unknown) => read }))
import { getGradeoStats, GRADEO_STATS_EMPTY } from "@/lib/gradeo-stats"

function client(responses: unknown[]) {
  let index = 0
  return {
    from: vi.fn(() => {
      const result = responses[index++]
      const builder = {
        select: vi.fn(() => builder), eq: vi.fn(() => builder), gt: vi.fn(() => builder),
        order: vi.fn(() => builder), limit: vi.fn(() => builder), abortSignal: vi.fn(() => builder),
        then: (resolve: (value: unknown) => unknown) => Promise.resolve(result).then(resolve),
      }
      return builder
    }),
  }
}

beforeEach(() => { mocks.getSupabase.mockReset() })
describe("GRADEO read-only metrics", () => {
  it("works without configuration", async () => {
    mocks.getSupabase.mockReturnValue(null)
    expect(await getGradeoStats()).toEqual(GRADEO_STATS_EMPTY)
  })
  it("retries after an unavailable query", async () => {
    mocks.getSupabase.mockReturnValueOnce(null)
      .mockReturnValueOnce(client([{ count: 919 }, { count: 84 }, { data: [] }]))
    expect(await getGradeoStats()).toEqual(GRADEO_STATS_EMPTY)
    expect(await getGradeoStats()).toMatchObject({ professors: 919, reviews: 84, live: true })
  })
  it("distinguishes zero from unavailable", async () => {
    mocks.getSupabase.mockReturnValue(client([{ count: 0 }, { count: 0 }, { data: [] }]))
    const stats = await getGradeoStats()
    expect(stats).toMatchObject({ professors: 0, reviews: 0, live: true, topProfessors: [] })
  })
  it("normalizes real-shaped data and skips invalid rankings", async () => {
    const fixture = client([{ count: 919 }, { count: 84 }, { data: [
      { first_name: "Docente", last_name: "Ejemplo", total_score: 4.875 },
      { first_name: "", last_name: "", total_score: 5 },
      { first_name: "No válido", total_score: "not-a-number" },
    ] }])
    mocks.getSupabase.mockReturnValue(fixture)
    expect(await getGradeoStats()).toMatchObject({
      professors: 919, reviews: 84, live: true, topProfessors: [{ name: "Docente Ejemplo", score: "4.9" }],
    })
    expect(fixture.from.mock.results[1].value.eq).toHaveBeenCalledWith("status", "approved")
    for (const result of fixture.from.mock.results) expect(result.value.abortSignal).toHaveBeenCalledWith(expect.any(AbortSignal))
  })
  it("recovers from an API error without labelling data live", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {})
    mocks.getSupabase.mockReturnValue(client([{ error: { message: "offline" } }, { count: null }, { data: [] }]))
    expect(await getGradeoStats()).toEqual(GRADEO_STATS_EMPTY)
  })
})
