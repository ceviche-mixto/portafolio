import { ChevronDown, ExternalLink, Github, Lock, Mail } from "lucide-react"
import { CopyEmailButton } from "@/components/ui/CopyEmailButton"
import { buttonVariants } from "@/components/ui/button-variants"
import type { TranslationDict } from "@/lib/i18n"
import { IDENTITY } from "@/lib/site"

/**
 * Enlaces de un proyecto: «Ver en vivo» y «Código».
 *
 * Un botón sólo aparece si su URL existe: enlazar a un repositorio privado o a
 * un dominio que aún no está desplegado da un 404 al visitante, que es peor que
 * no ofrecer el enlace.
 *
 * Cuando no hay repositorio público pero el código existe, se ofrece la vía
 * real para revisarlo: un panel nativo `<details>` con el correo, que funciona
 * sin JavaScript.
 */
export function ProjectLinks({
  repo,
  demo,
  liveLabel,
  liveNote,
  codeLabel,
  newTabHint,
  projectName,
  codeOnRequest = false,
  onRequestLabel,
  requestCopy,
}: {
  repo: string | null
  demo: string | null
  liveLabel: string
  /** Aclaración junto al enlace público, p. ej. que el panel requiere cuenta. */
  liveNote?: string
  codeLabel: string
  newTabHint: string
  projectName: string
  codeOnRequest?: boolean
  onRequestLabel?: string
  requestCopy: TranslationDict["projects"]["codeRequest"]
}) {
  const showRequestNote = !repo && codeOnRequest && onRequestLabel
  const subject = `${requestCopy.subject}: ${projectName}`
  const message = requestCopy.message.replace("{project}", projectName)

  if (!repo && !demo && !showRequestNote) return null

  return (
    <div className="flex min-w-0 flex-wrap items-start gap-3">
      {demo && (
        <a
          href={demo}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${liveLabel} — ${projectName} (${newTabHint})`}
          className={buttonVariants()}
        >
          <ExternalLink aria-hidden="true" />
          {liveLabel}
        </a>
      )}
      {demo && liveNote && <p className="flex min-h-11 items-center text-sm text-muted-foreground">{liveNote}</p>}

      {repo && (
        <a
          href={repo}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${codeLabel} — ${projectName} (${newTabHint})`}
          className={buttonVariants({ variant: "secondary" })}
        >
          <Github aria-hidden="true" />
          {codeLabel}
        </a>
      )}

      {showRequestNote && (
        <details className="group/request min-w-0 max-w-full">
          <summary
            aria-label={`${onRequestLabel} — ${projectName}`}
            className="flex min-h-11 w-fit max-w-full cursor-pointer list-none items-center gap-2 rounded-full border border-dashed border-border px-4 py-2 text-sm font-medium text-body transition-colors hover:border-highlight hover:text-foreground [&::-webkit-details-marker]:hidden"
          >
            <Lock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
            {onRequestLabel}
            <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open/request:rotate-180" aria-hidden="true" />
          </summary>
          <div className="mt-4 max-w-sm space-y-3 text-sm leading-relaxed text-body">
            <p>{requestCopy.description.replace("{project}", projectName)}</p>
            <p className="select-text font-medium text-foreground [overflow-wrap:anywhere]">{IDENTITY.email}</p>
            <div className="flex flex-wrap items-start gap-3">
              <CopyEmailButton
                email={IDENTITY.email}
                labels={{ idle: requestCopy.copyEmail, copied: requestCopy.copied, failed: requestCopy.copyFailed }}
              />
              <a
                href={`mailto:${IDENTITY.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`}
                className={buttonVariants({ variant: "secondary" })}
              >
                <Mail aria-hidden="true" />
                {requestCopy.compose}
              </a>
            </div>
            <p>{requestCopy.mailHint}</p>
          </div>
        </details>
      )}
    </div>
  )
}
