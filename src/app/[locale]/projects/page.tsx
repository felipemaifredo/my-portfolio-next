import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { ProjectsPage } from "@/ui/pages/ProjectsPage"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Metadata" })
  return { title: t("projectsTitle") }
}

export default function page() {
  return <ProjectsPage />
}
