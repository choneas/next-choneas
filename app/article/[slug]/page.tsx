import type { Metadata } from 'next'
import NotionPage from "@/components/notion-page";
import { getTranslations } from 'next-intl/server';
import { ArticleHeader } from "@/components/article-header";
import { getArticle } from "@/lib/content";

export async function generateMetadata(
    {params}: {params: Promise<{slug: string}>}
): Promise<Metadata> {
    const slug = (await params).slug;
    const t = await getTranslations('Metadata')
    const { metadata } = await getArticle(slug);

    return {
        title: metadata.title + t('suffix'),
        description: metadata.description,
        keywords: metadata.category,
        openGraph: {
            images: metadata.cover
        }
    }
}

export default async function Article({
    params,
}: {
    params: Promise<{ slug: string }>,
}) {
    const slug = (await params).slug;
    const { metadata, recordMap } = await getArticle(slug);

    return (
        <>
            <ArticleHeader article={metadata} />

            <NotionPage recordMap={recordMap}/>
        </>
    )
}