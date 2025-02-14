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
                <div className="relative -mt-[64px] w-screen -ml-[calc((100vw-100%)/2+0.5rem)] overflow-hidden mb-6">
                    <div className="relative md:h-[40vh] h-[80vh]">
                        <Image
                            fill
                            src={post.cover}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                            <div className="h-full container mx-auto flex flex-col justify-end pb-8">
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
                                <p className="text-gray-300 text-sm mt-4">
                                    {t('created_at') + (post.created_date ? formatDate(post.created_date, locale) : '') + (!isTweet ? ' · ' + t('updated_at') + (post.last_edit_date ? formatDate(post.last_edit_date, locale) : '') : '')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="container mx-auto mb-6">
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