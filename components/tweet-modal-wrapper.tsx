"use client"

import { useEffect } from "react";
import { useDisclosure } from "@heroui/modal";
import { useRouter } from "next/navigation";
import { TweetModal } from "@/components/tweet-modal";
import type { ExtendedRecordMap } from "notion-types";
import type { PostMetadata } from "@/types/content";

export function TweetModalWrapper({
  recordMap,
  metadata
}: {
  recordMap: ExtendedRecordMap;
  metadata: PostMetadata;
}) {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    onOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      router.push("/");
    }
    onOpenChange();
  };

  return (
    <TweetModal
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      recordMap={recordMap}
      metadata={metadata}
    />
  );
}
