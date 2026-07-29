"use client"

import * as React from "react"
import { ExternalLink, Github } from "lucide-react"

/**
 * Par de enlaces «Ver en vivo» / «Código» de un proyecto.
 *
 * Si `demo` es `null` el botón no se renderiza, en lugar de dejar un enlace roto:
 * así el sitio puede publicarse antes de tener la URL de producción y no miente
 * sobre lo que hay detrás.
 */
export function ProjectLinks({
  repo,
  demo,
  liveLabel,
  codeLabel,
  newTabHint,
  projectName,
}: {
  repo: string | null
  demo: string | null
  liveLabel: string
  codeLabel: string
  newTabHint: string
  projectName: string
}) {
  if (!repo && !demo) return null

  return (
    <div className="flex flex-wrap items-center gap-3">
      {demo && (
        <a
          href={demo}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${liveLabel} — ${projectName} (${newTabHint})`}
          className="flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-bold text-emerald-950 transition-colors hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
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
          className="flex items-center gap-2 rounded-full border border-zinc-700 px-5 py-2.5 text-sm font-bold text-zinc-200 transition-colors hover:border-zinc-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
        >
          <Github className="h-4 w-4" aria-hidden="true" />
          {codeLabel}
        </a>
      )}
    </div>
  )
}
