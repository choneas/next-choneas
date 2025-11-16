"use client"

import { useEffect } from "react"
import Image from "next/image"
import { Tags } from "@/components/tags"
import { useTranslations, useLocale } from "next-intl"
import { formatDate } from "@/lib/format"
import type { PostMetadata } from "@/types/content"
import { usePostMetadata } from "@/stores/post"

export function PostHeader({ post, isTweet }: { post: PostMetadata, isTweet?: boolean }) {
    const t = useTranslations("Post-Header")
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
                        <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent">
                            <div className={`h-full flex flex-col justify-end pb-8 ${!isTweet ? 'article-container' : 'px-8'}`}>
                                <Tags
                                    tags={post.tags || []}
                                    variant="soft"
                                    className="mb-2 backdrop-blur"
                                />
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
                                    {t('created_at') + (post.created_time ? formatDate(post.created_time, locale) : '') + (!isTweet ? ' · ' + t('updated_at') + (post.last_edited_time ? formatDate(post.last_edited_time, locale) : '') : '')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={isTweet ? 'pt-6 pb-4' : 'article-container pt-8'}>
                    <Tags
                        tags={post.tags || []}
                        variant="soft"
                    />
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
                        {t('created_at') + (post.created_time ? formatDate(post.created_time, locale) : '') + (!isTweet ? ' · ' + t('updated_at') + (post.last_edited_time ? formatDate(post.last_edited_time, locale) : '') : '')}
                    </p>
                </div>
            )}
        </>
    )
}