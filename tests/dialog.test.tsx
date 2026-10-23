import { useRef, useState } from "react"
import { afterEach, expect, it, vi } from "vitest"
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react"
import axe from "axe-core"
import { LanguageProvider } from "@/components/i18n/LanguageProvider"
import GradeoCaseStudyDialog from "@/features/gradeo/GradeoCaseStudyDialog"

afterEach(cleanup)
it("labels the modal, closes with Escape and returns focus", async () => {
  function Example() {
    const [open, setOpen] = useState(true)
    const returnFocus = useRef<HTMLButtonElement>(null)
    return <LanguageProvider initialLanguage="en"><button ref={returnFocus}>Origin</button>
      <GradeoCaseStudyDialog open={open} onOpenChange={setOpen} returnFocus={returnFocus}
        stats={{ professors: 919, reviews: 84, topProfessors: [], live: true }} />
    </LanguageProvider>
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
