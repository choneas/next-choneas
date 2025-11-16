"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { IoSearch } from "react-icons/io5"
import type { Key } from "@react-types/shared"
import type { PostMetadata } from "@/types/content"
import { ArticleCard } from "./article-card"
import { ArticleFilter } from "./article-filter"

function parseTags(articles: PostMetadata[]): string[] {
    const tagSet = new Set<string>()
    articles.forEach(article => {
        article.tags?.forEach(tag => tagSet.add(tag))
    })
    return Array.from(tagSet)
}

interface ArticleListProps {
    articles: PostMetadata[]
    sortOrder?: 'asc' | 'desc'
    linkParam?: 'slug' | 'id' | 'notionid'
    showTime?: boolean
}

export function ArticleList({
    articles,
    sortOrder = 'desc',
    linkParam = 'slug',
    showTime = false
}: ArticleListProps) {
    const t = useTranslations("Article-Filter")
    const [selectedTags, setSelectedTags] = useState<Key[]>([])
    const [searchValue, setSearchValue] = useState('')

    const tags = parseTags(articles)

    const filteredArticles = articles.filter(article => {
        if (selectedTags.length > 0) {
            const tagArray = selectedTags.map(String)
            if (!article.tags || !tagArray.some(t => article.tags?.includes(t))) {
                return false
            }
        }

        if (searchValue) {
            const searchTerms = searchValue.toLowerCase().split(/\s+/).filter(term => term.length > 0)
            const titleLower = article.title.toLowerCase()
            const descriptionLower = article.description?.toLowerCase() || ''
            const tocContent = article.toc?.map(item => item.text.toLowerCase()).join(' ') || ''

            return searchTerms.every(term =>
                titleLower.includes(term) ||
                descriptionLower.includes(term) ||
                tocContent.includes(term)
            )
        }

        return true
    }).sort((a, b) => {
        const timeA = a.created_time ? new Date(a.created_time).getTime() : 0
        const timeB = b.created_time ? new Date(b.created_time).getTime() : 0
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB
    })

    return (
        <>
            <ArticleFilter
                tags={tags}
                selectedTags={selectedTags}
                onSelectedTagsChange={setSelectedTags}
                searchValue={searchValue}
                onSearchChange={setSearchValue}
            />
            <div className="grid grid-cols-1 gap-8 mt-4">
                {filteredArticles.length > 0 ? (
                    filteredArticles.map((article: PostMetadata) => (
                        <ArticleCard
                            key={article.id}
                            linkParam={linkParam}
                            article={article}
                            showTime={showTime}
                        />
                    ))
                ) : (
                    <div className="flex flex-col justify-center items-center h-44">
                        <IoSearch size={48} />
                        <p className="pt-4 text-content4-foreground">{t('not-found')}</p>
                    </div>
                )}
            </div>
        </>
    )
}
