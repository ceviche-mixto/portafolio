"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"
import { buttonVariants } from "./button-variants"

/**
 * Copia el correo y confirma el resultado en una región activa, también para
 * lectores de pantalla. Si el navegador niega el portapapeles, el mensaje
 * ofrece la alternativa en lugar de fallar en silencio.
 */
export function CopyEmailButton({
  email,
  labels,
  className,
}: {
  email: string
  labels: { idle: string; copied: string; failed: string }
  className?: string
}) {
  const [state, setState] = React.useState<"idle" | "copied" | "failed">("idle")

  React.useEffect(() => {
    if (state === "idle") return
    const timer = setTimeout(() => setState("idle"), 4000)
    return () => clearTimeout(timer)
  }, [state])

  async function copy() {
    try {
      await navigator.clipboard.writeText(email)
      setState("copied")
    } catch {
      setState("failed")
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button type="button" onClick={copy} className={buttonVariants({ variant: "secondary", className })}>
        {state === "copied" ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
        {state === "copied" ? labels.copied : labels.idle}
      </button>
      <p role="status" aria-live="polite" className="min-h-5 text-sm text-body">
        {state === "failed" ? labels.failed : state === "copied" ? labels.copied : ""}
      </p>
    </div>
  )
}
