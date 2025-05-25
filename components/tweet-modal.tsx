import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal"
import type { ExtendedRecordMap } from "notion-types"
import { PostHeader } from "@/components/post-header"
import NotionPage from "@/components/notion-page"
import { Comment } from "@/components/comment"
import { PostMetadata } from "@/types/content"
import { TweetContentSkeleton } from "@/components/moment-card"
import { useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl"
import { formatDate } from "@/lib/format";

export function TweetModal(
    { isLoading, isOpen, onOpenChange, recordMap, metadata }: {
        isLoading?: boolean,
        isOpen: boolean,
        onOpenChange: (open: boolean) => void,
        recordMap: ExtendedRecordMap,
        metadata: PostMetadata
    }
) {
    const locale = useLocale();
    const t = useTranslations('Metadata')
    const originalTitleRef = useRef(document.title);

    useEffect(() => {
        if (isOpen) {
            document.title = (metadata.title || formatDate(metadata.created_date, locale, true, false)) + t('suffix');
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                  metaDescription.setAttribute('content', metadata.description || '');
            }
            let metaBacklink = document.querySelector('meta[name="giscus:backlink"]');
            if (!metaBacklink) {
                metaBacklink = document.createElement('meta');
                metaBacklink.setAttribute('name', 'giscus:backlink');
                document.head.appendChild(metaBacklink);
            }
            metaBacklink.setAttribute('content', `https://choneas.com/tweet/${metadata.id}`);
        } else {
            document.title = originalTitleRef.current;
        }
    }, [isOpen, metadata, locale, t]);

    return (
        <Modal
            radius="lg"
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            scrollBehavior="outside"
            backdrop="blur"
            placement="top"
            size="lg"
            classNames={{
                header: "font-normal -mb-8",
                closeButton: "absolute top-4 right-4 size-8"
            }}
        >
            <ModalContent className="container mx-auto pt-8 px-4 sm:px-8 md:px-12 md:max-w-3xl">
                {() => (
                    <>
                        <ModalHeader>
                            {!isLoading && <PostHeader isTweet post={metadata}/>}
                        </ModalHeader>

                        <ModalBody>
                            {isLoading ? (
                                <TweetContentSkeleton images={metadata.photos?.length ? Array(metadata.photos.length).fill(0) : undefined} />
                            ) : (
                                <NotionPage
                                    recordMap={recordMap}
                                    type="tweet-details"
                                />
                            )}
                        </ModalBody>

                        <ModalFooter>
                            <Comment
                                type="tweet"
                                metadata={metadata}
                                className="mt-8 w-full pb-16"
                            />
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}