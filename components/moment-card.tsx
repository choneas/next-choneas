'use client'

import { Card, CardHeader, CardBody, CardFooter, Skeleton, Button, Image, useDisclosure } from "@heroui/react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
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

export function MomentCard({ moment }: { moment: PostMetadata }) {
    const isTweet = moment.type === "Tweet"
    const t = useTranslations('Moment')
    const router = useRouter()
    const locale = useLocale()
    const contentRef = useRef<HTMLDivElement>(null)
    const [isLoading, setIsLoading] = useState(isTweet)
    const [isExpanded, setIsExpanded] = useState(true)
    const [recordMap, setRecordMap] = useState<ExtendedRecordMap | null>(null)
    const { isOpen, onOpen, onOpenChange } = useDisclosure()

    useEffect(() => {
        if (!isTweet || !moment.id) return
        const fetchPost = async () => {
            try {
                const { recordMap: data } = await getPost(moment.id as string, true)
                setRecordMap(data)
            } catch (error) {
                console.error('Error fetching post:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchPost()
    }, [moment.id, isTweet])

    useEffect(() => {
        if (!isTweet) return
        if (moment.description) setIsExpanded(false)
        if (contentRef.current) {
            const height = contentRef.current.offsetHeight;
            if (height > 148) {
                setIsExpanded(false)
            } else {
                setIsExpanded(true)
            }
        }
    }, [moment.description, isTweet, recordMap])

    if (!moment.id) return null;

    return (
        <>
            <Card
                classNames={{
                    base: `shadow-none p-3 outline-2 shadow bg-content2 ${!isTweet ? 'cursor-pointer' : undefined}`,
                    header: "z-20 flex inline-flex gap-2 content-center",
                    body: `z-20 bg-content2 -my-3 px-3 pb-2 ${isTweet && !isLoading && "animate-fade-in-opacity"}`,
                    footer: `z-20 bg-content2 px-3 py-2 ${isTweet && !isLoading && "animate-fade-in-opacity"}`
                }}
            >
                <CardHeader onClick={() => !isTweet && router.push('/article/' + moment.slug)}>
                    <Avatar isMe size="sm" />
                    <p className="text-content4-foreground">
                        {isTweet && 'Choneas · '}
                        {formatDate(moment.created_time, locale, true)}
                        {!isTweet && " · " + t('article-publish')}
                    </p>
                </CardHeader>

                <CardBody onClick={() => !isTweet && router.push('/article/' + moment.slug)}>
                    <h3 className={(isTweet && isLoading) ? 'pb-3' : 'font-bold'}>
                        {moment.icon && moment.icon + ' '}{moment.title}
                    </h3>
                    {isTweet ? (
                        isLoading ? (
                            <TweetContentSkeleton
                                hasDescription={moment.description ? true : false}
                                images={moment.photos?.length ? Array(moment.photos.length).fill(0) : undefined}
                            />
                        ) : recordMap ? (
                            <>
                                {!moment.description ? (
                                    <div ref={contentRef} className="relative max-h-[178px] overflow-hidden">
                                        <NotionPage recordMap={recordMap} type="tweet-preview" />
                                    </div>
                                ) : (
                                    <div className="inline-flex relative items-center space-x-2 pl-4">
                                        <p className="text-content3-foreground">
                                            <LuMessageCircle size={20} className="w-auto h-auto absolute top-3" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            {moment.description}
                                        </p>
                                    </div>
                                )}
                                {!isExpanded && !moment.description && (
                                    <div className="relative -mt-8 z-10 h-12 flex items-center justify-center bg-linear-to-t from-content2/95 to-transparent">
                                        <Button disableRipple onPress={onOpen} color="primary" variant="flat" radius="full" size="sm" className="text-primary backdrop-blur-md">
                                            {t('view-all')}
                                        </Button>
                                    </div>
                                )}
                                <ImagePreview images={moment.photos ?? []} onOpen={onOpen} />
                            </>
                        ) : null
                    ) : (
                        <div className="py-2">
                            <p className="text-content3-foreground">{moment.description}</p>
                        </div>
                    )}
                </CardBody>

                {isTweet && !isLoading && (
                    <CardFooter>
                        <div className={moment.description ? "w-full grid gap-2 lg:grid-cols-6" : 'w-full grid grid-cols-1'}>
                            <Button disableRipple disableAnimation onPress={onOpen} variant="flat" color="primary" className={`${!moment.description && "hidden"} w-full justify-start text-primary`} startContent={<MdOpenInBrowser size={20} />}>
                                {t('view-all')}
                            </Button>

                            <Button disableRipple disableAnimation onPress={onOpen} variant="flat" className={`w-full justify-start ${moment.description && 'lg:col-span-5'}`} startContent={<LuMessageSquare size={18} />}>
                                {t('comment-placeholder')}
                            </Button>
                        </div>
                    </CardFooter>
                )}
            </Card>
            {isTweet && recordMap && (
                <TweetModal isOpen={isOpen} onOpenChange={onOpenChange} recordMap={recordMap} metadata={moment} />
            )}
        </>
    )
}

function ImagePreview({ images, onOpen }: { images: string[], onOpen?: () => void }) {
    if (images.length === 0) return null;
    const displayImages = images.slice(0, 6);
    const mobileColumns = displayImages.length >= 2 ? 'grid-cols-3' : 'grid-cols-1'
    const getDesktopColumns = (count: number) => {
        return ['grid-cols-1', 'grid-cols-2', 'grid-cols-3', 'grid-cols-4'][Math.min(count, 4) - 1]
    };

    return (
        <div 
            className={`z-20 my-3 grid gap-1 ${mobileColumns} md:${getDesktopColumns(displayImages.length)} w-full`}
        >
            {displayImages.map((image, i) => (
                <div
                    key={i}
                    className="relative w-full h-full" 
                >
                    <div className="relative w-full h-full overflow-hidden rounded-xs">
                        <Image
                            src={image}
                            onClick={onOpen}
                            alt=""
                            className="object-cover w-full h-full hover:scale-105 transition-transform cursor-pointer"
                        />
                    </div>
                </div>
            ))}
        </div>
    )
}

export function TweetContentSkeleton(
    { images, hasDescription }: { images?: number[]; hasDescription?: boolean }
) {
    return (
        <>
            <Skeleton className="rounded-lg max-w-[24rem] h-6" />
            <Skeleton className="rounded-lg max-w-lg mt-2 h-6" />

            {images && images.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2 my-3">
                    {images.map((_, i) => (
                        <Skeleton 
                            key={i} 
                            className={`rounded-lg aspect-square ${images.length === 1 ? 'md:col-span-2 md:h-96' : ''}`}
                        />
                    ))}
                </div>
            )}

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
