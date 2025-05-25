"use client"

import { useEffect } from "react"
import Image from "next/image"
import { Chip } from "@heroui/react"
import { useTranslations, useLocale } from "next-intl"
import { formatDate } from "@/lib/format"
import type { PostMetadata } from "@/types/content"
import { usePostMetadata } from "@/stores/post"

export function PostHeader({ post, isTweet }: { post: PostMetadata, isTweet?: boolean }) {
    const t = useTranslations("Article-Header")
    const locale = useLocale()
    const { setPostMetadata } = usePostMetadata()

    useEffect(() => {
        setPostMetadata?.(post)
    }, [post, setPostMetadata])
    return (
        <>
            {post.cover ? (
                <div className="relative -mt-[72px] min-w-screen overflow-hidden mb-3">
                    <div className="relative md:h-[50vh] h-[80vh]">
                        <Image
                            fill
                            src={post.cover}
                            alt={post.title}
                            quality={80}
                            className="w-full h-full object-cover"
                        />
                        <div className={`absolute ${!isTweet && 'sm:pl-24 md:pl-48'} mx-auto pl-8 inset-0 bg-linear-to-t from-black/70 to-transparent`}>
                            <div className="h-full mx-4 flex flex-col justify-end pb-8">
                                <div className="flex flex-wrap gap-2">
                                    {post.category?.map((category) => (
                                        <Chip
                                            key={category}
                                            variant="dot"
                                            classNames={{
                                                base: "mb-2 backdrop-blur",
                                                content: "text-white",
                                            }}
                                        >
                                            {category}
                                        </Chip>
                                    ))}
                                </div>
                                <span className="text-5xl font-bold my-2">
                                    {post.icon}
                                </span>
                                <h1 className="text-4xl text-white font-bold my-4">
                                    {post.title.length !== 0 ?
                                        post.title
                                        :
                                        t('tweet-details')
                                    }
                                </h1>
                                <p className="text-gray-300 text-sm mt-4">
                                    {t('created_at') + (post.created_date ? formatDate(post.created_date, locale) : '') + (!isTweet ? ' · ' + t('updated_at') + (post.last_edit_date ? formatDate(post.last_edit_date, locale) : '') : '')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={isTweet ? 'pt-6 pb-4' : 'container mx-auto pt-8 px-8 sm:px-24 md:px-48 md:max-w-6xl'}>
                    <div className="flex flex-wrap gap-2">
                        {post.category?.map((category) => (
                            <Chip
                                key={category}
                                variant="dot"
                                className="mr-2"
                            >
                                {category}
                            </Chip>
                        ))}
                    </div>
                    <h1 className="text-5xl font-bold my-2">
                        {post.icon}
                    </h1>
                    <h1 className="text-4xl font-bold my-4">
                        {post.title.length !== 0 ?
                            post.title
                            :
                            t('tweet-details')
                        }
                    </h1>
                    <p className="text-content2-foreground">
                        {t('created_at') + (post.created_date ? formatDate(post.created_date, locale) : '') + (!isTweet ? ' · ' + t('updated_at') + (post.last_edit_date ? formatDate(post.last_edit_date, locale) : '') : '')}
                    </p>
                </div>
            )}
        </>
    )
}