export type SectionPosition = { id: string; top: number }

/** Pure scroll-spy calculation, including short sections at the document end. */
export function activeSection(
  sections: SectionPosition[],
  offset: number,
  atBottom: boolean,
): string | null {
  if (atBottom) return sections.at(-1)?.id ?? null
  // Browser zoom can round an anchor's final position by a fraction of a pixel.
  return sections.filter((section) => section.top <= offset + 2).at(-1)?.id ?? null
}
