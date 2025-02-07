import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { projects } from "@/data/project"
import { ProjectCard } from "@/components/project-card"

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('Project')
    return {
        title: t('title') + " | Choneas's blog",
        description: t('description') + projects.forEach(project => project.name),
    }
}

export default async function Project(){
    const t = await getTranslations("Project")

    return (
        <>
            <h1>{t('title')}</h1>
            <p className="pt-4 text-lg">{t('description')}</p>

            <div className="flex flex-col gap-4">
                {projects.map((project, index) => (
                    <ProjectCard key={index} project={project} />
                ))}
            </div>
        </>
    )
}