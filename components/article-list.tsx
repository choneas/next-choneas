"use client"

import { useState } from "react"
import type { PostMetadata } from "@/types/content"
import { ArticleCard } from "@/components/article-card"
import { ArticleFilter } from "@/components/article-filter"

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
    const [filteredArticles, setFilteredArticles] = useState<PostMetadata[]>(articles)

    return (
        <>
            <ArticleFilter
                articles={articles}
                sortOrder={sortOrder}
                onFilteredArticlesChange={setFilteredArticles}
            />
            <div className="grid grid-cols-1 gap-6 mt-4">
                {filteredArticles.map((article: PostMetadata) => (
                    <ArticleCard
                        key={article.id}
                        linkParam={linkParam}
                        article={article}
                        showTime={showTime}
                    />
                ))}
            </div>
        </>
    )
}
