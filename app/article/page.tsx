import type { Metadata } from 'next'
import { getTranslations } from "next-intl/server"
import { getAllPosts } from "@/lib/content"
import { ArticleList } from '@/components/article-list'

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('Article')
    return {
        title: t('title') + " | Choneas's blog",
        description: t('description'),
    }
}

export default async function Contents() {
    const t = await getTranslations("Article")
    const { articles } = await getAllPosts()

    return (
        <div className="container mx-auto px-8 sm:px-24 pt-8">
            <h1>{t('title')}</h1>
            <p>{t('description')}</p>

            <div className='py-4'>
                <ArticleList articles={articles} />
            </div>
        </div>
    )
}