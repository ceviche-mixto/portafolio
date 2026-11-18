import type { ProjectStatus } from "@/content/projects/types"
import { cn } from "@/lib/utils"

/** Estado del proyecto con texto; el color sólo lo refuerza. */
export function StatusBadge({ status, label }: { status: ProjectStatus; label: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold",
        status === "production"
          ? "border-highlight/30 bg-highlight/10 text-highlight"
          : "border-evidence bg-evidence/40 text-foreground"
      )}
    >
      <span aria-hidden="true" className={cn("h-1.5 w-1.5 rounded-full", status === "production" ? "bg-highlight" : "bg-foreground")} />
      {label}
    </span>
  )
}
