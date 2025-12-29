import type { Metadata } from "next"
import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { SocialLink } from "@/components/social-link"

import { socialLinks, techStacks } from "@/data/about"

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('About')
    const tm = await getTranslations('Metadata')
    return {
        title: t('title') + tm('suffix'),
        description: t('description'),
    }
}

export default async function About() {
    const t = await getTranslations("About")

    return (
        <main id="main-content" className="flex flex-col gap-6">
            <div className="space-y-4">
                <h1>{t("title")}</h1>
                <span className="text-lg">{t("description")}</span>
            </div>

            <div className="space-y-4">
                <h2>{t("social-links")}</h2>
                <div className="flex flex-wrap gap-4">
                    {socialLinks.map((link, index) => (
                        <SocialLink key={index} {...link} />
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <h2>{t("tech-stack")}</h2>
                <div className="flex flex-wrap gap-3 text-3xl">
                    {techStacks.map((stack, index) => (
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
        </main>
    )
}