import { cva, type VariantProps } from "class-variance-authority"

/**
 * Variantes de acción compartidas por enlaces y botones.
 *
 * Viven fuera de `button.tsx` porque un Server Component no puede llamar a una
 * función exportada desde un módulo `"use client"`: los enlaces de navegación
 * se renderizan en el servidor con estas clases y `Button` las reutiliza para
 * las acciones. El foco usa el contorno global de `globals.css`.
 */
export const buttonVariants = cva(
  "inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold whitespace-nowrap transition-colors disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-foreground",
        secondary: "border border-border text-subtle hover:border-strong hover:text-foreground",
        link: "rounded-lg px-3 py-0 font-medium text-body underline decoration-border-strong underline-offset-4 hover:text-foreground",
      },
    },
    defaultVariants: { variant: "primary" },
  }
)

export type ButtonVariantProps = VariantProps<typeof buttonVariants>
