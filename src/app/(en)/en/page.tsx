import { HomePage } from "@/components/site/HomePage"
import { homeMetadata } from "@/lib/metadata"

export const metadata = homeMetadata("en")

export default function Home() {
  return <HomePage lang="en" />
}
