"use client"

import { useEffect } from "react"
import Image from "next/image"
import { Tags } from "@/components/tags"
import { useTranslations, useLocale } from "next-intl"
import { formatDate } from "@/lib/format"
import type { PostMetadata } from "@/types/content"
import { usePostMetadata } from "@/stores/post"
import { Avatar } from "@/components/avatar"

interface PostHeaderProps {
    post: PostMetadata;
    isTweet?: boolean;
    avatarSrc?: string;
}

export function PostHeader({ post, isTweet, avatarSrc }: PostHeaderProps) {
    const t = useTranslations("Post-Header")
    const locale = useLocale()
    const { setPostMetadata } = usePostMetadata()
    const isSocialPost = post.platform === 'x' || post.platform === 'bluesky'

    useEffect(() => {
        setPostMetadata?.(post)
    }, [post, setPostMetadata])

    if (isSocialPost) {
        return (
            <div className="flex gap-3 items-center py-4">
                <Avatar platform={post.platform} src={avatarSrc} size="md" name="Choneas" />
                <div className="flex flex-col">
                    <span className="text-base font-medium">Choneas</span>
                    <span className="text-sm text-content3-foreground">
                        {formatDate(post.created_time, locale, true)}
                    </span>
                </div>
            </div>
        )
    }

    return (
        <>
            {post.cover ? (
                <div className="post-header relative -mt-[72px] max-w-screen overflow-hidden mb-3">
                    <div className="relative md:h-[50vh] h-[80vh]">
                        <Image
                            fill
                            src={post.cover}
                            alt={post.title}
                            quality={80}
                            className="h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent">
                            <div className={`h-full flex flex-col justify-end pb-8 ${!isTweet ? 'max-w-6xl px-8 sm:px-24 md:px-48' : 'px-8'}`}>
                                <Tags
                                    tags={post.tags || []}
                                    variant="soft"
                                    size="lg"
                                />
                                <span className="text-5xl font-bold my-2">
                                    {post.icon}
                                </span>
                                <h1 role="heading" className="text-4xl text-white font-bold my-4">
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
                <div className={isTweet ? 'pt-6 pb-4' : 'post-header max-w-6xl mx-auto px-8 sm:mt-20 sm:px-24 md:px-48 pt-8'}>
                    <Tags
                        tags={post.tags || []}
                        variant="soft"
                        size="lg"
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