import type { Metadata } from "next"
import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { SocialLink } from "@/components/social-link"

import { SocialLinks, TechStacks } from "@/data/about"

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('About')
    return {
        title: t('title') + " | Choneas's blog",
    }
}

export default async function About() {
    const t = await getTranslations("About")

    return (
        <div className="flex flex-col gap-6">
            <div className="space-y-4">
                <h1>{t("title")}</h1>
                <p className="text-lg">{t("description")}</p>
            </div>

            <div className="space-y-4">
                <h2>{t("social-links")}</h2>
                <div className="flex flex-wrap gap-4">
                    {SocialLinks.map((link, index) => (
                        <SocialLink key={index} {...link} />
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <h2>{t("tech-stack")}</h2>
                <div className="flex flex-wrap gap-3 text-3xl">
                    {TechStacks.map((stack, index) => (
                        <Link
                            target="_blank"
                            key={index}
                            aria-label={stack.name}
                            href={stack.href!}
                        >
                            {stack.icon}
                        </Link>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <h2>{t('dream-job')}</h2>
                <p className="text-lg">{t("dream-description")}</p>
            </div>
        </div>
    )
}