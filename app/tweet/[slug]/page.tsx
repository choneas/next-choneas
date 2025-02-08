import { getPost } from "@/lib/content";
import { TweetModalWrapper } from "@/components/tweet-modal-wrapper";
import type { ExtendedRecordMap } from "notion-types";
import type { PostMetadata } from "@/types/content";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { recordMap, metadata } = await getPost(resolvedParams.slug, true);
  
  return (
    <TweetModalWrapper 
      recordMap={recordMap as ExtendedRecordMap} 
      metadata={metadata as PostMetadata} 
    />
  );
}