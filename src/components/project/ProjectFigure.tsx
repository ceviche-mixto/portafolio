import Image from "next/image"
import type { ProjectMedia } from "@/content/projects/types"
import type { Language } from "@/lib/language"
import { cn } from "@/lib/utils"

/**
 * Captura o esquema de un proyecto con su leyenda. La caja reserva la
 * proporción del medio, así que no hay salto al cargar.
 */
export function ProjectFigure({
  media,
  lang,
  sizes,
  className,
}: {
  media: ProjectMedia
  lang: Language
  sizes: string
  className?: string
}) {
  return (
    <figure className={cn("flex flex-col gap-3", className)}>
      <div className="overflow-clip rounded-2xl border border-border bg-card">
        <Image
          src={media.src}
          width={media.width}
          height={media.height}
          alt={media.alt[lang]}
          sizes={sizes}
          className="h-auto w-full"
        />
      </div>
      <figcaption className="text-sm text-muted-foreground">{media.caption[lang]}</figcaption>
    </figure>
  )
}
