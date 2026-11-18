import { existsSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import { getProject, nextProject, PROJECT_SLUGS, PROJECTS, projectPath } from "@/content/projects"

/** Recorre un valor y devuelve cada objeto `{ es, en }` que encuentra. */
function localized(value: unknown, path = "", found: { path: string; es: unknown; en: unknown }[] = []) {
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>
    if ("es" in record && "en" in record) found.push({ path, es: record.es, en: record.en })
    else for (const [key, child] of Object.entries(record)) localized(child, `${path}.${key}`, found)
  }
  return found
}

describe("project collection", () => {
  it("has exactly the three published systems, with unique slugs", () => {
    expect(PROJECT_SLUGS).toEqual(["gradeo", "onectrl", "farmaplus"])
    expect(new Set(PROJECT_SLUGS).size).toBe(PROJECT_SLUGS.length)
    expect(JSON.stringify(PROJECTS).toLowerCase()).not.toContain("vexo")
  })

  it.each(PROJECTS.map((project) => [project.slug, project] as const))("has complete Spanish and English text in %s", (_, project) => {
    const fields = localized(project)
    expect(fields.length).toBeGreaterThan(20)
    for (const field of fields) {
      expect(typeof field.es, field.path).toBe("string")
      expect(typeof field.en, field.path).toBe("string")
      expect((field.es as string).trim(), field.path).not.toBe("")
      expect((field.en as string).trim(), field.path).not.toBe("")
    }
  })

  it.each(PROJECTS.map((project) => [project.slug, project] as const))("ships every image it references for %s", (_, project) => {
    for (const media of [project.cover, ...project.gallery]) {
      expect(existsSync(join(process.cwd(), "public", media.src)), media.src).toBe(true)
    }
  })

  it.each(PROJECTS.map((project) => [project.slug, project] as const))("documents at least two decisions with stable anchors in %s", (_, project) => {
    expect(project.decisions.length).toBeGreaterThanOrEqual(2)
    const ids = project.decisions.map((decision) => decision.id)
    expect(new Set(ids).size).toBe(ids.length)
    ids.forEach((id) => expect(id).toMatch(/^[a-z0-9-]+$/))
  })

  it("walks the cases in a circle", () => {
    expect(nextProject("gradeo").slug).toBe("onectrl")
    expect(nextProject("onectrl").slug).toBe("farmaplus")
    expect(nextProject("farmaplus").slug).toBe("gradeo")
  })

  it("resolves slugs and localized paths", () => {
    expect(getProject("gradeo")?.name).toBe("GRADEO")
    expect(getProject("vexo")).toBeUndefined()
    expect(projectPath("es", "onectrl")).toBe("/proyectos/onectrl")
    expect(projectPath("en", "onectrl")).toBe("/en/projects/onectrl")
  })
})
