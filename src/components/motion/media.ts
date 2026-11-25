/** Consultas de medios compartidas por las islas de movimiento. */
export const FINE_POINTER = "(hover: hover) and (pointer: fine)"
export const MOTION_OK = "(prefers-reduced-motion: no-preference)"

/** `false` en el servidor y donde no exista `matchMedia` (jsdom, navegadores viejos). */
export function matches(query: string): boolean {
  return typeof window !== "undefined" && Boolean(window.matchMedia?.(query).matches)
}

/** WAAPI disponible y el sistema no pide movimiento reducido. */
export function canAnimate(): boolean {
  return typeof Element !== "undefined" && typeof Element.prototype.animate === "function" && matches(MOTION_OK)
}
