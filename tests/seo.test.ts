import { describe, expect, it } from "vitest"
import robots from "@/app/robots"
import sitemap from "@/app/sitemap"
import { PROJECTS } from "@/content/projects"
import { caseStructuredData, homeStructuredData, serializeJsonLd } from "@/lib/structured-data"
import { SITE_URL, SOCIALS } from "@/lib/site"

type Node = Record<string, unknown>
const graph = (data: { "@graph": unknown[] }) => data["@graph"] as Node[]

describe("structured data", () => {
  it.each(["es", "en"] as const)("describes the person and the three systems in %s", (lang) => {
    const [person, list] = graph(homeStructuredData(lang))
    expect(person["@type"]).toBe("Person")
    expect(person.sameAs).toEqual([SOCIALS.github, SOCIALS.linkedin])
    expect(person.jobTitle).toBe(lang === "es" ? "Desarrollador de software" : "Software developer")
    const items = (list.itemListElement as Node[]).map((entry) => entry.item as Node)
    expect(items.map((item) => item.name)).toEqual(["GRADEO", "OneCtrl", "FARMAPLUS"])
    expect(items.map((item) => item["@type"])).toEqual(["SoftwareApplication", "SoftwareApplication", "CreativeWork"])
    const me = { "@id": person["@id"] }
    const [gradeo, onectrl, farmaplus] = items
    for (const own of [gradeo, farmaplus]) {
      expect(own.author).toEqual(me)
      expect(own.creator).toEqual(me)
    }
    // OneCtrl es un sistema de equipo: la persona contribuye, no lo creó.
    expect(onectrl.contributor).toEqual(me)
    expect(onectrl).not.toHaveProperty("author")
    expect(onectrl).not.toHaveProperty("creator")
    expect(JSON.stringify(list).toLowerCase()).not.toContain("vexo")
  })

  it("points each case page at its own project", () => {
    for (const project of PROJECTS) {
      const [, work] = graph(caseStructuredData("en", project))
      expect(work.name).toBe(project.name)
      expect(work.mainEntityOfPage).toBe(`${SITE_URL}/en/projects/${project.slug}`)
    }
  })

  it("cannot close its script tag from inside the data", () => {
    const out = serializeJsonLd({ text: "</script><script>alert(1)</script>" })
    expect(out).not.toContain("<")
    expect(JSON.parse(out).text).toBe("</script><script>alert(1)</script>")
  })
})

describe("sitemap and robots", () => {
  it("lists the 8 static URLs with alternates and content dates", () => {
    const entries = sitemap()
    expect(entries.map((entry) => entry.url.replace(SITE_URL, ""))).toEqual([
      "/", "/en",
      "/proyectos/gradeo", "/en/projects/gradeo",
      "/proyectos/onectrl", "/en/projects/onectrl",
      "/proyectos/farmaplus", "/en/projects/farmaplus",
    ])
    entries.forEach((entry) => {
      expect(entry.lastModified).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(Object.keys(entry.alternates?.languages ?? {})).toEqual(["es-PE", "en"])
    })
    expect(sitemap()).toEqual(entries)
  })

  it("keeps robots to standard directives", () => {
    const rules = robots()
    expect(rules).not.toHaveProperty("host")
    expect(rules.sitemap).toBe(`${SITE_URL}/sitemap.xml`)
  })
})
