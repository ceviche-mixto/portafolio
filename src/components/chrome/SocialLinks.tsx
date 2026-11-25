import { Github, Linkedin } from "lucide-react"
import { SOCIALS } from "@/lib/site"
import { cn } from "@/lib/utils"

/**
 * Enlaces a perfiles, GitHub primero: es el que busca antes un revisor técnico.
 *
 * Cada enlace lleva `aria-label` porque sólo contiene un icono; sin etiqueta un
 * lector de pantalla lo anunciaría como «enlace» y nada más.
 */
const LINKS = [
  { key: "github", href: SOCIALS.github, label: "GitHub", Icon: Github, hover: "hover:text-foreground hover:border-strong" },
  { key: "linkedin", href: SOCIALS.linkedin, label: "LinkedIn", Icon: Linkedin, hover: "hover:text-info hover:border-info/50" },] as const

export function SocialLinks({
  size = "md",
  className,
  newTabHint,
}: {
  size?: "md" | "lg"
  className?: string
  /** Texto entre paréntesis en la etiqueta, p. ej. «abre en una pestaña nueva». */
  newTabHint: string
}) {
  const pad = size === "lg" ? "p-4" : "p-3"
  const icon = size === "lg" ? "h-6 w-6" : "h-5 w-5"

  return (
    <ul className={cn("flex items-center gap-3", className)}>
      {LINKS.map(({ key, href, label, Icon, hover }) => (
        <li key={key}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${label} (${newTabHint})`}
            className={cn(
              "tactile flex rounded-full border border-soft bg-card text-muted-foreground transition-colors",
              pad,
              hover
            )}
          >
            <Icon className={icon} aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  )
}
