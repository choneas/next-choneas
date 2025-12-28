import type { Metadata } from 'next'
import { getTranslations, getLocale } from "next-intl/server"
import { getAllPosts } from "@/lib/content"
import { ArticleList } from '@/components/article-list'

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('Article')
    const tm = await getTranslations('Metadata')
    return {
        title: t('title') + tm('suffix'),
        description: t('description'),
    }
}

export default async function Contents() {
    const t = await getTranslations("Article")
    const tagT = await getTranslations("Tag")
    const locale = await getLocale()

    // Data is cached internally, translation happens here
    const { articles } = await getAllPosts(
        (key: string) => tagT(key),
        locale,
        false // Don't include social posts for article page
    )

    return (
        <main className="container mx-auto px-8 sm:mt-20 sm:px-24 pt-8">
            <h1>{t('title')}</h1>
            <p>{t('description')}</p>

            <div className='mt-8'>
                <ArticleList articles={articles} />
            </div>
        </main>
    )
}
