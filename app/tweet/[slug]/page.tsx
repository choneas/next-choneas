import { getPost } from "@/lib/content";
import { TweetModalWrapper } from "@/components/tweet-modal-wrapper";
import type { ExtendedRecordMap } from "notion-types";
import type { PostMetadata } from "@/types/content";

export default async function Page({ params }: { params: { slug: string } }) {
  const { recordMap, metadata } = await getPost(params.slug, true);
  return (
    // 将 post 数据传递给客户端包装组件
    <TweetModalWrapper recordMap={recordMap as ExtendedRecordMap} metadata={metadata as PostMetadata} />
  );
}