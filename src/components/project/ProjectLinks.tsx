"use client"

import * as React from "react"
import { Check, ChevronDown, Copy, ExternalLink, Github, Lock, Mail } from "lucide-react"
import { IDENTITY } from "@/lib/site"
import { useTranslation } from "@/hooks/useTranslation"

/**
 * Enlaces de un proyecto: «Ver en vivo» y «Código».
 *
 * Un botón sólo aparece si su URL existe: enlazar a un repositorio privado o a
 * un dominio que aún no está desplegado da un 404 al visitante, que es peor que
 * no ofrecer el enlace.
 *
 * Cuando no hay repositorio público pero el código existe, se dice en lugar de
 * callar. El silencio se lee como «no hay nada»; «disponible a petición» es
 * cierto y además le da al reclutador un siguiente paso.
 */
export function ProjectLinks({
  repo,
  demo,
  liveLabel,
  codeLabel,
  newTabHint,
  projectName,
  codeOnRequest = false,
  onRequestLabel,
}: {
  repo: string | null
  demo: string | null
  liveLabel: string
  codeLabel: string
  newTabHint: string
  projectName: string
  codeOnRequest?: boolean
  onRequestLabel?: string
}) {
  const { t } = useTranslation()
  const copy = t.projects.codeRequest
  const [copyState, setCopyState] = React.useState<"idle" | "copied" | "failed">("idle")
  React.useEffect(() => {
    if (copyState === "idle") return
    const timer = setTimeout(() => setCopyState("idle"), 4000)
    return () => clearTimeout(timer)
  }, [copyState])

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(IDENTITY.email)
      setCopyState("copied")
    } catch {
      setCopyState("failed")
    }
  }

  const showRequestNote = !repo && codeOnRequest && onRequestLabel
  const subject = `${copy.subject}: ${projectName}`
  const message = copy.message.replace("{project}", projectName)

  if (!repo && !demo && !showRequestNote) return null

  return (
    <div className="flex min-w-0 flex-wrap items-start gap-3">
      {demo && (
        <a
          href={demo}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${liveLabel} — ${projectName} (${newTabHint})`}
          className="flex min-h-11 items-center gap-2 rounded-full bg-highlight px-5 py-2.5 text-sm font-bold text-emerald-950 transition-colors hover:bg-highlight"
        >
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
          {liveLabel}
        </a>
      )}

      {repo && (
        <a
          href={repo}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${codeLabel} — ${projectName} (${newTabHint})`}
          className="flex min-h-11 items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-bold text-subtle transition-colors hover:border-strong hover:text-foreground"
        >
          <Github className="h-4 w-4" aria-hidden="true" />
          {codeLabel}
        </a>
      )}

      {showRequestNote && (
        <details className="group/request min-w-0 max-w-full" onToggle={(event) => { if (!event.currentTarget.open) setCopyState("idle") }}>
          <summary
            aria-label={`${onRequestLabel} — ${projectName}`}
            className="flex min-h-11 w-fit max-w-full cursor-pointer list-none items-center gap-2 rounded-full border border-dashed border-border px-4 py-2 text-sm font-medium text-body transition-colors hover:border-highlight hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight [&::-webkit-details-marker]:hidden"
          >
            <Lock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
            {onRequestLabel}
            <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open/request:rotate-180" aria-hidden="true" />
          </summary>
          <div className="mt-4 max-w-sm space-y-3 text-sm leading-relaxed text-body">
            <p>{copy.description.replace("{project}", projectName)}</p>
            <p className="select-text font-medium text-foreground [overflow-wrap:anywhere]">{IDENTITY.email}</p>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={copyEmail}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 py-2 font-medium text-subtle transition-colors hover:border-strong hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight">
                {copyState === "copied" ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                {copyState === "copied" ? copy.copied : copy.copyEmail}
              </button>
              <a href={`mailto:${IDENTITY.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 py-2 font-medium text-subtle transition-colors hover:border-strong hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight">
                <Mail className="h-4 w-4" aria-hidden="true" />{copy.compose}
              </a>
            </div>
            <p>{copy.mailHint}</p>
            <p role="status">{copyState === "failed" ? copy.copyFailed : copyState === "copied" ? copy.copied : ""}</p>
          </div>
        </details>
      )}
    </div>
  )
}
