import { useEffect, useRef } from "react";
import { Modal } from "@heroui/react";
import type { ExtendedRecordMap } from "notion-types";
import { useLocale, useTranslations } from "next-intl";
import { PostHeader } from "@/components/post-header";
import NotionPage from "@/components/notion-page";
import { Comment } from "@/components/comment";
import { TweetContentSkeleton } from "@/components/moment-card";
import { formatDate } from "@/lib/format";
import { PostMetadata } from "@/types/content";

interface TweetModalProps {
    isLoading?: boolean;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    recordMap?: ExtendedRecordMap;
    metadata: PostMetadata;
}

export function TweetModal({
    isLoading,
    isOpen,
    onOpenChange,
    recordMap,
    metadata
}: TweetModalProps) {
    const locale = useLocale();
    const t = useTranslations("Metadata");
    const originalTitleRef = useRef<string>("");

    useEffect(() => {
        if (typeof window === 'undefined') return;

        if (isOpen) {
            originalTitleRef.current = document.title;
            document.title = (metadata.title || formatDate(metadata.created_time, locale, true)) + t("suffix");

            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                metaDescription.setAttribute("content", metadata.description || "");
            }

            let metaBacklink = document.querySelector('meta[name="giscus:backlink"]');
            if (!metaBacklink) {
                metaBacklink = document.createElement("meta");
                metaBacklink.setAttribute("name", "giscus:backlink");
                document.head.appendChild(metaBacklink);
            }
            metaBacklink.setAttribute("content", `https://choneas.com/tweet/${metadata.slug || metadata.id}`);
        } else {
            document.title = originalTitleRef.current;
        }
    }, [isOpen, metadata, locale, t]);

    return (
        <Modal.Container
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            variant="blur"
            placement="top"
            scroll="outside"
        >
            <Modal.Dialog className="container mx-auto pb-4 px-4 sm:px-8 md:px-12 md:max-w-3xl">
                {() => (
                    <>
                        <Modal.CloseTrigger />
                        <Modal.Header>
                            {!isLoading && <PostHeader isTweet post={metadata} />}
                        </Modal.Header>
                        <Modal.Body className="px-6 py-4">
                            <div className="space-y-4">
                                {isLoading ? (
                                    <TweetContentSkeleton
                                        images={metadata.photos?.length ? Array(metadata.photos.length).fill(0) : undefined}
                                    />
                                ) : recordMap ? (
                                    <>
                                        <NotionPage recordMap={recordMap} type="tweet-details" />
                                        <Comment type="tweet" metadata={metadata} />
                                    </>
                                ) : (
                                    <p className="text-sm text-content3-foreground">
                                        Detail will be available once the content finishes loading.
                                    </p>
                                )}
                            </div>
                        </Modal.Body>
                    </>
                )}
            </Modal.Dialog>
        </Modal.Container>
    );
}