import type { Metadata } from 'next'
import { notFound } from 'next/navigation';
import { getTranslations, getLocale } from 'next-intl/server';
import NotionPage from "@/components/notion-page";
import { PostHeader } from "@/components/post-header";
import { Comment } from '@/components/comment';
import { TableOfContents } from '@/components/table-of-contents';
import { getPost, ArticleNotFoundError } from "@/lib/content";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const slug = (await params).slug;
    const t = await getTranslations('Metadata');
    const tagT = await getTranslations('Tag');
    const locale = await getLocale();

    const { metadata } = await getPost(
        slug,
        (key: string) => tagT(key),
        locale
    );

    return {
        title: metadata.title + t('suffix'),
        description: metadata.description,
        keywords: metadata.tags,
        openGraph: {
            images: metadata.cover
        }
    };
}

export default async function Article({ params }: PageProps) {
    const slug = (await params).slug;
    const tagT = await getTranslations('Tag');
    const locale = await getLocale();

    try {
        const { metadata, recordMap } = await getPost(
            slug,
            (key: string) => tagT(key),
            locale
        );

        return (
            <main id="main-content">
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
