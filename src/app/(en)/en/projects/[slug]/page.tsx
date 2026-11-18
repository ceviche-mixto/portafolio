import type { Metadata } from "next"
import { CaseStudyPage } from "@/components/case-study/CaseStudyPage"
import { getProject, PROJECT_SLUGS } from "@/content/projects"
import { caseMetadata } from "@/lib/metadata"

type Props = { params: Promise<{ slug: string }> }

// Sólo existen los casos de la colección; cualquier otro slug es un 404.
export const dynamicParams = false
// La lectura viva de GRADEO se regenera cada cinco minutos (ISR).
export const revalidate = 300

export function generateStaticParams() {
  return PROJECT_SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject((await params).slug)
  return project ? caseMetadata("en", project) : {}
}

export default async function Page({ params }: Props) {
  return <CaseStudyPage lang="en" slug={(await params).slug} />
}
