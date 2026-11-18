import { useRef, useState } from "react"
import { afterEach, expect, it, vi } from "vitest"
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react"
import axe from "axe-core"
import { translations } from "@/lib/i18n"
import GradeoCaseStudyDialog from "@/features/gradeo/GradeoCaseStudyDialog"

afterEach(cleanup)
it("labels the modal, closes with Escape and returns focus", async () => {
  function Example() {
    const [open, setOpen] = useState(true)
    const returnFocus = useRef<HTMLButtonElement>(null)
    const t = translations.en
    return <><button ref={returnFocus}>Origin</button>
      <GradeoCaseStudyDialog open={open} onOpenChange={setOpen} returnFocus={returnFocus}
        content={{ title: t.caseStudy.title, desc: t.caseStudy.desc, closeLabel: t.nav.close,
          sections: [{ title: t.caseStudy.challengeTitle, body: t.caseStudy.challengeText }],
          links: { repo: null, demo: "https://gradeo.vercel.app", liveLabel: t.gradeo.viewLive, codeLabel: t.gradeo.viewCode,
            newTabHint: t.nav.newTab, projectName: "GRADEO", requestCopy: t.projects.codeRequest } }} />
    </>
  }
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null)
  render(<Example />)
  const dialog = await screen.findByRole("dialog")
  expect(dialog.getAttribute("aria-modal")).toBe("true")
  expect(dialog.getAttribute("aria-labelledby")).toBeTruthy()
  expect(dialog.getAttribute("aria-describedby")).toBeTruthy()
  const results = await axe.run(dialog, { rules: { "color-contrast": { enabled: false } } })
  expect(results.violations.map((issue) => issue.id)).toEqual([])
  fireEvent.keyDown(dialog, { key: "Escape" })
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
  await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("button", { name: "Origin" })))
})
