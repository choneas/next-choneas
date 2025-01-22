"use client"

import { useEffect } from "react"
import Image from "next/image"
import { Chip } from "@heroui/react"
import { useTranslations, useLocale } from "next-intl"
import { formatDate } from "@/lib/format"
import type { ArticleMetadata } from "@/types/content"
import { useArticleMetadata } from "@/stores/article"

export function ArticleHeader({ article }: { article: ArticleMetadata }) {
    const t = useTranslations("Article-Header")
    const locale = useLocale()
    const { setArticleMetadata } = useArticleMetadata()

    useEffect(() => {
        setArticleMetadata?.(article)
    }, [article, setArticleMetadata])

    return (
        <>
            {article.cover ? (
                <div className="relative -mt-[64px] w-screen -ml-[calc((100vw-100%)/2)]">
                    <div className="relative md:h-[40vh] h-[80vh]">
                        <Image
                            fill
                            src={article.cover}
                            alt={article.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                            <div className="h-full container mx-auto px-8 sm:px-24 md:px-48 flex flex-col justify-end pb-8">
                                <div className="flex flex-wrap gap-2">
                                    {article.category?.map((category) => (
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
                                <h1 className="text-4xl font-bold text-white mt-2">
                                    {article.title}
                                </h1>
                                <p className="text-gray-300 text-sm mt-4">
                                    {t('created_at') + (article.created_date ? formatDate(article.created_date, locale) : '') + ' · ' + t('updated_at') + (article.last_edit_date ? formatDate(article.last_edit_date, locale) : '')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="container mx-auto px-8 sm:px-24 md:px-48">
                    <div className="flex flex-wrap gap-2">
                        {article.category?.map((category) => (
                            <Chip
                                key={category}
                                variant="dot"
                                className="mr-2"
                            >
                                {category}
                            </Chip>
                        ))}
                    </div>
                    <h1 className="text-4xl font-bold my-4">{article.title}</h1>
                    <p className="text-content2-foreground">
                        {t('created_at') + (article.created_date ? formatDate(article.created_date, locale) : '') + ' · ' + t('updated_at') + (article.last_edit_date ? formatDate(article.last_edit_date, locale) : '')}
                    </p>
                </div>
            )}
        </>
    )
}