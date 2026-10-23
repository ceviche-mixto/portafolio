"use client"

import * as React from "react"
import { Github, Linkedin, Instagram } from "lucide-react"
import { SOCIALS } from "@/lib/site"
import { cn } from "@/lib/utils"

/**
 * Enlaces a perfiles, GitHub primero.
 *
 * El orden importa: antes los únicos enlaces del sitio eran LinkedIn e Instagram,
 * repetidos, y GitHub no aparecía en ninguna parte — justo el enlace que busca
 * primero un revisor técnico (ver U-01).
 *
 * Cada enlace lleva `aria-label`, porque sólo contienen un icono: sin etiqueta un
 * lector de pantalla los anuncia como «enlace» y nada más (ver A-02).
 */
const LINKS = [
  { key: "github", href: SOCIALS.github, label: "GitHub", Icon: Github, hover: "hover:text-foreground hover:border-strong" },
  { key: "linkedin", href: SOCIALS.linkedin, label: "LinkedIn", Icon: Linkedin, hover: "hover:text-info hover:border-info/50" },
  { key: "instagram", href: SOCIALS.instagram, label: "Instagram", Icon: Instagram, hover: "hover:text-personal hover:border-personal/50" },
] as const

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
              "flex rounded-full border border-soft bg-card/60 text-muted-foreground shadow-xl backdrop-blur-md transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight focus-visible:ring-offset-2 focus-visible:ring-offset-background",
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
