import type { Metadata } from 'next'
import { getTranslations } from "next-intl/server"
import { getAllPosts } from "@/lib/content"
import { ArticleListWithFilter } from '@/components/article-list-with-filter'

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
    const { articles } = await getAllPosts()

    return (
        <div className="container mx-auto px-8 sm:px-24 pt-8">
            <h1>{t('title')}</h1>
            <p>{t('description')}</p>
            
            <div className='py-4'>
                <ArticleListWithFilter articles={articles} />
            </div>
        </div>
    )
}