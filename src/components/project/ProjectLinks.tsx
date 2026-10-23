"use client"

import * as React from "react"
import { ExternalLink, Github, Lock } from "lucide-react"
import { IDENTITY } from "@/lib/site"

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
  const showRequestNote = !repo && codeOnRequest && onRequestLabel

  if (!repo && !demo && !showRequestNote) return null

  return (
    <div className="flex flex-wrap items-center gap-3">
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
        <a
          href={`mailto:${IDENTITY.email}?subject=${encodeURIComponent(`${projectName}: ${onRequestLabel}`)}`}
          aria-label={`${onRequestLabel} — ${projectName}`}
          className="flex min-h-11 items-center gap-2 rounded-full border border-dashed border-border px-4 py-2 text-sm font-medium text-body transition-colors hover:border-highlight hover:text-foreground"
        >
          <Lock className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
          {onRequestLabel}
        </a>
      )}
    </div>
  )
}
