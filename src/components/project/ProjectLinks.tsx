"use client"

import * as React from "react"
import { ExternalLink, Github, Lock } from "lucide-react"

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
          className="flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-bold text-emerald-950 transition-colors hover:bg-emerald-400"
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
          className="flex items-center gap-2 rounded-full border border-zinc-700 px-5 py-2.5 text-sm font-bold text-zinc-200 transition-colors hover:border-zinc-500 hover:text-white"
        >
          <Github className="h-4 w-4" aria-hidden="true" />
          {codeLabel}
        </a>
      )}

      {showRequestNote && (
        <p className="flex items-center gap-2 rounded-full border border-dashed border-zinc-700 px-4 py-2 text-xs font-medium text-zinc-300">
          <Lock className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
          {onRequestLabel}
        </p>
      )}
    </div>
  )
}
