import type { Metadata } from 'next'
import NotionPage from "@/components/notion-page";
import { getTranslations } from 'next-intl/server';
import { PostHeader } from "@/components/post-header";
import { Comment } from '@/components/comment';
import { getPost, ArticleNotFoundError } from "@/lib/content";
import { notFound } from 'next/navigation';

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const slug = (await params).slug;
  const t = await getTranslations('Metadata')
  const { metadata } = await getPost(slug, true);

  return {
    title: (metadata.title || metadata.created_time.toLocaleDateString()) + t('suffix'),
    description: metadata.description,
    keywords: metadata.tags,
    openGraph: {
      images: metadata.cover
    }
  }
}

export default async function TweetPage({
  params,
}: {
  params: Promise<{ slug: string }>,
}) {
  const slug = (await params).slug;
  try {
    const { metadata, recordMap } = await getPost(slug, true);

    return (
      <>
        <PostHeader post={metadata} />

        <div className='article-container pt-8'>
          <NotionPage recordMap={recordMap} type="tweet-details" />

          <Comment type='tweet' metadata={metadata} className='mt-8' />
        </div>
      </>
    );
  } catch (error) {
    if (error instanceof ArticleNotFoundError) {
      notFound();
    }
    throw error;
  }
}