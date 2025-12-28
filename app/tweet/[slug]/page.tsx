import type { Metadata } from 'next'
import { notFound } from 'next/navigation';
import { getTranslations, getLocale } from 'next-intl/server';
import NotionPage from "@/components/notion-page";
import { PostHeader } from "@/components/post-header";
import { Comment } from '@/components/comment';
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
    locale,
    true
  );

  return {
    title: (metadata.title || metadata.created_time.toLocaleDateString()) + t('suffix'),
    description: metadata.description,
    keywords: metadata.tags,
    openGraph: {
      images: metadata.cover
    }
  };
}

export default async function TweetPage({ params }: PageProps) {
  const slug = (await params).slug;
  const tagT = await getTranslations('Tag');
  const locale = await getLocale();

  try {
    const { metadata, recordMap } = await getPost(
      slug,
      (key: string) => tagT(key),
      locale,
      true
    );

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
