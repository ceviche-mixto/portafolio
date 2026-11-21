import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

/**
 * Presupuesto de movimiento: 0 KB de JavaScript de motion en la portada. El
 * movimiento es CSS y sigue `prefers-reduced-motion`; estas librerías no deben
 * volver al bundle sin una decisión explícita.
 */
const BANNED = ["framer-motion", "motion", "zustand", "@base-ui/react"]

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? sourceFiles(join(dir, entry.name)) : /\.(ts|tsx)$/.test(entry.name) ? [join(dir, entry.name)] : []
  )
}

describe("motion budget", () => {
  it("keeps motion and state libraries out of the dependencies", () => {
    const pkg = JSON.parse(readFileSync(join(process.cwd(), "package.json"), "utf8"))
    const deps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies })
    expect(deps.filter((name) => BANNED.includes(name))).toEqual([])
  })

  it("never imports them from the source", () => {
    const offenders = sourceFiles(join(process.cwd(), "src")).filter((file) =>
      BANNED.some((name) => new RegExp(`from ["']${name}(/[^"']*)?["']`).test(readFileSync(file, "utf8")))
    )
    expect(offenders).toEqual([])
  })

  it("guards every CSS animation behind the reduced-motion preference", () => {
    const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8")
    expect(css).toContain("@media (prefers-reduced-motion: reduce)")
    expect(css).not.toContain("data-motion")
  })
})
