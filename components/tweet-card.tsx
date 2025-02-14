'use client'

import { Card, CardHeader, CardBody, CardFooter, Skeleton, Button, Image, useDisclosure } from "@heroui/react"
import { useState, useEffect, useRef } from "react"
import { useLocale, useTranslations } from "next-intl"
import { LuMessageCircle, LuMessageSquare } from "react-icons/lu"
import { MdOpenInBrowser } from "react-icons/md"
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
    const { isOpen, onOpen, onOpenChange } = useDisclosure()

    const validTweet = Boolean(tweet?.id);
    useEffect(() => {
        if (!validTweet) return
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
        if (!validTweet) return
        if (tweet.description) setIsExpanded(false)
        if (contentRef.current) {
            const height = contentRef.current.offsetHeight;
            if (height > 160) {
                setIsExpanded(false)
            } else {
                setIsExpanded(true)
            }
        }
    }, [tweet.description, validTweet, recordMap])

    if (!validTweet) return null;

    return (
        <>
            <Card classNames={{
                base: "shadow-none p-3 border",
                header: "z-20 flex inline-flex gap-2 content-center",
                body: `z-20 bg-content2 -my-3 px-3 pb-2 ${!isLoading && "animate-fadeIn opacity-0"}`,
                footer: `z-20 bg-content2 px-3 py-2 ${!isLoading && "animate-fadeIn opacity-0"}`
            }}>
                <CardHeader>
                    <Avatar isMe size="sm" />
                    <p className="text-content4-foreground">
                        Choneas · {formatDate(tweet.created_date, locale, true)}
                    </p>
                </CardHeader>

                <CardBody>
                    <h3 className={isLoading ? 'pb-3' : 'font-bold'}>{tweet.title}</h3>
                    {isLoading ? (
                        <TweetContentSkeleton hasDescription={tweet.description ? true : false} images={tweet.photos?.length ? Array(tweet.photos.length).fill(0) : undefined} />
                    ) : recordMap && (
                        <>
                            {!tweet.description ? (
                                <div ref={contentRef} className="relative max-h-[178px] overflow-hidden">
                                    <NotionPage recordMap={recordMap} type="tweet-preview" />
                                </div>
                            ) :
                                <div className="inline-flex relative items-cener space-x-2 pl-4">
                                    <p className="text-content3-foreground">
                                        <LuMessageCircle size={20} className="w-auto h-auto absolute top-3" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        {tweet.description}
                                    </p>
                                </div>
                            }

                            {!isExpanded && !tweet.description && (
                                <div className="relative -mt-8 z-10">
                                    <div className={`h-12 flex items-center justify-center`}>
                                        <Button disableRipple onPress={onOpen} color="primary" variant="flat" radius="full" size="sm" className="text-primary backdrop-blur-md">{t('view-all')}</Button>
                                    </div>
                                </div>
                            )}

                            <ImagePreview images={tweet.photos ?? []} />
                        </>
                    )}
                </CardBody>

                <CardFooter>
                    {!isLoading &&
                        <div className={tweet.description ? "w-full grid gap-2 lg:grid-cols-6" : 'w-full gird grid-cols-1'}>
                            <Button disableRipple disableAnimation onPress={onOpen} variant="flat" color="primary" className={`${!tweet.description && "hidden"} w-full justify-start text-primary`} startContent={<MdOpenInBrowser size={20} />}>
                                {t('view-all')}
                            </Button>

                            <Button disableRipple disableAnimation onPress={onOpen} variant="flat" className={`w-full justify-start ${tweet.description && 'lg:col-span-5'}`} startContent={<LuMessageSquare size={18} />}>
                                {t('comment-placeholder')}
                            </Button>
                        </div>
                    }
                </CardFooter>
            </Card>
            {recordMap && <TweetModal isOpen={isOpen} onOpenChange={onOpenChange} recordMap={recordMap} metadata={tweet} />}
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
            z-20 my-3 grid gap-2 overflow-hidden
            grid-cols-3 md:${getDesktopColumns(displayImages.length)}
            ${displayImages.length >= 1 ? 'max-h-[12rem]' : ''}
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
                        className="object-cover max-h-[12rem] hover:brightness-90 transition-all"
                    />
                </div>
            ))}
        </div>
    );
}

export function TweetContentSkeleton(
    { images, hasDescription }: { images?: number[]; hasDescription?: boolean }
) {
    return (
        <>
            <Skeleton className="rounded-lg max-w-[24rem] h-6" />
            <Skeleton className="rounded-lg max-w-[32rem] mt-2 h-6" />

            {images &&
                <div className={`grid grid-cols-${images} gap-2 mt-4`}>
                    {images.map((_, i) =>
                        <Skeleton key={i} className="rounded-lg h-32" />
                    )}
                </div>
            }

            {hasDescription ?
                <div className="grid lg:grid-cols-6 mt-4 gap-2">
                    <Skeleton className="rounded-lg h-10" />
                    <Skeleton className="rounded-lg lg:col-span-5 h-10" />
                </div>
                :
                <Skeleton className="rounded-lg w-full mt-2 h-10" />
            }
        </>
    )
}