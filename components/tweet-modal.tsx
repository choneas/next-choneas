import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal"
import type { ExtendedRecordMap } from "notion-types"
import { ArticleHeader } from "@/components/article-header"
import NotionPage from "@/components/notion-page"
import { Comment } from "@/components/comment"
import { PostMetadata } from "@/types/content"

export function TweetModal(
    { isOpen, onOpenChange, recordMap, metadata }: {
        isOpen: boolean,
        onOpenChange: (open: boolean) => void,
        recordMap: ExtendedRecordMap,
        metadata: PostMetadata
    }
) {
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            scrollBehavior="outside"
            backdrop="blur"
            placement="top"
            size="lg"
            classNames={{
                header: "font-normal",
                closeButton: "absolute top-4 right-4 size-8"
            }}
        >
            <ModalContent className="container mx-auto pt-8 px-4 sm:px-12 md:px-24 md:max-w-[64rem]">
                {() => (
                    <>
                        <ModalHeader>
                            <ArticleHeader article={metadata}/>
                        </ModalHeader>

                        <ModalBody>
                            <NotionPage recordMap={recordMap}/>
                        </ModalBody>

                        <ModalFooter>
                            <Comment type="tweet" metadata={metadata} className="mt-8 w-full pb-16"/>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}