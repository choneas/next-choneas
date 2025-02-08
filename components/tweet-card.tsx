'use client'

import { Card, CardHeader, CardBody, CardFooter, Skeleton, Button, Image, useDisclosure } from "@heroui/react"
import { useState, useEffect, useRef } from "react"
import { useLocale, useTranslations } from "next-intl"
import NotionPage from "@/components/notion-page"
import { TweetModal } from "@/components/tweet-modal"
import { Avatar } from "@/components/avatar"
import type { ExtendedRecordMap } from "notion-types"
import type { PostMetadata } from "@/types/content"
import { formatDate } from "@/lib/format"
import { getPost } from "@/lib/content"

export function TweetCard({
    tweet
}: {
    tweet: PostMetadata
}) {
    const t = useTranslations('Tweet')
    const locale = useLocale()
    const contentRef = useRef<HTMLDivElement>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isExpanded, setIsExpanded] = useState(true)
    const [recordMap, setRecordMap] = useState<ExtendedRecordMap | null>(null)
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const validTweet = Boolean(tweet?.id);
    useEffect(() => {
        if (!validTweet) return;
        const fetchPost = async () => {
            try {
                const { recordMap: data } = await getPost(tweet.id as string, true)
                setRecordMap(data)
            } catch (error) {
                console.error('Error fetching post:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchPost()
    }, [tweet.id, validTweet])

    useEffect(() => {
        if (!validTweet) return;
        if (contentRef.current) {
            const height = contentRef.current.offsetHeight;
            if (height > 160) {
                setIsExpanded(false)
            } else {
                setIsExpanded(true)
            }
        }
    }, [validTweet, recordMap])

    if (!validTweet) return null;

    return (
        <>
            <Card classNames={{
                base: "shadow-none p-3 border",
                header: "z-20 flex inline-flex gap-2 content-center",
                body: "z-20 bg-content1 -my-3 px-3 pb-2",
                footer: "z-20 bg-content1 px-3 py-2"
            }}>
                <CardHeader>
                    <Avatar isMe size="sm" />
                    <p className="text-content4-foreground">
                        Choneas · {formatDate(tweet.created_date, locale, true)}
                    </p>
                </CardHeader>

                <CardBody>
                    <h3 className={isLoading ? 'pb-3' : ''}>{tweet.title}</h3>
                    {isLoading ? (
                        <TweetContentSkeleton images={tweet.photos?.length ? Array(tweet.photos.length).fill(0) : undefined} />
                    ) : recordMap && (
                        <>
                            <div ref={contentRef} className="relative max-h-[178px] overflow-hidden">
                                <NotionPage recordMap={recordMap} type="tweet-preview" />
                            </div>
                            
                            {!isExpanded && (
                                <div className="relative -mt-8 z-10">
                                    <div className="h-12 bg-gradient-to-t from-content1 from-20% to-transparent flex items-center justify-center">
                                        <Button disableRipple onPress={onOpen} color="primary" variant="flat" radius="full" size="sm" className="text-primary backdrop-blur-xs">{t('view-all')}</Button>
                                    </div>
                                </div>
                            )}

                            <ImagePreview images={tweet.photos ?? []} />
                        </>
                    )}
                </CardBody>

                <CardFooter>
                    {!isLoading &&
                        <Button disableRipple disableAnimation onPress={onOpen} variant="flat" className="w-full justify-start">
                            {t('comment-placeholder')}
                        </Button>}
                </CardFooter>
            </Card>
            {recordMap && <TweetModal isOpen={isOpen} onOpenChange={onOpenChange} recordMap={recordMap} metadata={tweet}/>}

        </>
    )
}

function ImagePreview({ images, onOpen }: { images: string[], onOpen?: () => void }) {
    if (images.length === 0) return null;

    const displayImages = images.slice(0, 6);
    const getDesktopColumns = (count: number) => {
        if (count === 1) return 'grid-cols-1';
        if (count === 2) return 'grid-cols-2';
        if (count === 3) return 'grid-cols-3';
        return 'grid-cols-4';
    };

    return (
        <div className={`
            z-20 mt-4 grid gap-2
            grid-cols-3 md:${getDesktopColumns(displayImages.length)}
            ${displayImages.length === 1 ? 'max-h-96' : ''}
        `}>
            {displayImages.map((image, i) => (
                <div
                    key={i}
                    onClick={onOpen}
                    className={`
                        relative cursor-pointer
                        ${displayImages.length === 1 ? 'md:h-96' : 'aspect-square'}
                        ${displayImages.length === 1 ? 'md:col-span-2' : ''}
                    `}
                >
                    <Image
                        src={image}
                        alt={`Image ${i + 1}`}
                        radius="sm"
                        className="object-cover w-full h-full hover:brightness-90 transition-all"
                        classNames={{
                            wrapper: "w-full h-full"
                        }}
                    />
                </div>
            ))}
        </div>
    );
}

export function TweetContentSkeleton(
    { images }: { images?: number[] }
) {
    return (
        <>
            <Skeleton className="rounded-lg max-w-[24rem]">
                <div className="h-6" />
            </Skeleton>
            <Skeleton className="rounded-lg max-w-[32rem] mt-2">
                <div className="h-6" />
            </Skeleton>

            {images &&
                <div className={`grid grid-cols-${images} gap-2 mt-4`}>
                    {images.map((_, i) =>
                        <Skeleton key={i} className="rounded-lg"><div className="h-32" /></Skeleton>
                    )}
                </div>
            }
        </>
    )
}