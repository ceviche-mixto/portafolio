"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"
import { celebrate } from "@/components/motion/TactileFeedback"
import { buttonVariants } from "./button-variants"

/**
 * Copia el correo y confirma el resultado en una región activa, también para
 * lectores de pantalla. Si el navegador niega el portapapeles, el mensaje
 * ofrece la alternativa en lugar de fallar en silencio.
 *
 * Al copiar, el check entra con rebote, una píldora elástica asoma bajo el
 * botón y estalla una celebración breve (`celebrate`, WAAPI). La píldora es
 * visual (`aria-hidden`) y va fuera del flujo: la región activa ya lo anuncia.
 */
export function CopyEmailButton({
  email,
  labels,
  className,
}: {
  email: string
  labels: { idle: string; copied: string; failed: string; pill: string }
  className?: string
}) {
  const [state, setState] = React.useState<"idle" | "copied" | "failed">("idle")
  const button = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    if (state === "idle") return
    const timer = setTimeout(() => setState("idle"), 4000)
    return () => clearTimeout(timer)
  }, [state])

  async function copy() {
    try {
      await navigator.clipboard.writeText(email)
      setState("copied")
      celebrate(button.current)
    } catch {
      setState("failed")
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <button ref={button} type="button" onClick={copy} className={buttonVariants({ variant: "secondary", className: ["w-full", className] })}>
          {state === "copied" ? <Check aria-hidden="true" className="pop-in" /> : <Copy aria-hidden="true" />}
          <span>{state === "copied" ? labels.copied : labels.idle}</span>
        </button>
        {state === "copied" && (
          // Debajo, sobre la línea de estado (vacía al copiar): no tapa el botón vecino en móvil.
          <span aria-hidden="true" className="pointer-events-none absolute top-full left-1/2 z-10 mt-2 -translate-x-1/2">
            <span className="pop-in block rounded-full bg-highlight px-3 py-1 text-xs font-bold whitespace-nowrap text-white shadow-[0_6px_16px_-8px_rgba(37,59,214,0.6)]">
              {labels.pill}
            </span>
          </span>
        )}
      </div>
      <p role="status" aria-live="polite" className="min-h-5 text-sm text-body">
        {state === "failed" ? labels.failed : state === "copied" ? <span className="sr-only">{labels.copied}</span> : ""}
      </p>
    </div>
  )
}
