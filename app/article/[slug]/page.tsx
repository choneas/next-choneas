import type { Metadata } from 'next'
import NotionPage from "@/components/notion-page";
import { getTranslations } from 'next-intl/server';
import { PostHeader } from "@/components/post-header";
import { Comment } from '@/components/comment';
import { getPost, ArticleNotFoundError } from "@/lib/content";
import { notFound } from 'next/navigation';
import { TableOfContents } from '@/components/table-of-contents';

export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const slug = (await params).slug;
    const t = await getTranslations('Metadata')
    const { metadata } = await getPost(slug);

    return {
        title: metadata.title + t('suffix'),
        description: metadata.description,
        keywords: metadata.tags,
        openGraph: {
            // TODO: Open Graph
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
            <main>
                <PostHeader post={metadata} isTweet={false} />

                <div className="max-w-6xl mx-auto px-8 sm:px-24 md:px-48">
                    <NotionPage recordMap={recordMap} />
                    <Comment type='article' metadata={metadata} className='mt-8' />
                </div>

                <TableOfContents toc={metadata.toc!} type="Article" />
            </main>
        );
    } catch (error) {
        if (error instanceof ArticleNotFoundError) {
            notFound();
        }
        throw error;
    }
}
