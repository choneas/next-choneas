import type { Metadata } from 'next'
import NotionPage from "@/components/notion-page";
import { getTranslations } from 'next-intl/server';
import { ArticleHeader } from "@/components/article-header";
import { Comment } from '@/components/comment';
import { getPost, ArticleNotFoundError } from "@/lib/content";
import { notFound } from 'next/navigation';
import { TableOfContents } from '@/components/table-of-contents';

export async function generateMetadata(
    {params}: {params: Promise<{slug: string}>}
): Promise<Metadata> {
    const slug = (await params).slug;
    const t = await getTranslations('Metadata')
    const { metadata } = await getPost(slug);

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
    try {
        const { metadata, recordMap } = await getPost(slug);

        return (
            <>
                <ArticleHeader article={metadata} />

                <TableOfContents toc={metadata.toc!} />

                <NotionPage recordMap={recordMap}/>

                <Comment type='article' metadata={metadata} className='mt-8'/>
            </>
        );
    } catch (error) {
        if (error instanceof ArticleNotFoundError) {
            notFound();
        }
        throw error;
    }
}
