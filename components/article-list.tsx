"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
    const hasResults = filteredArticles.length > 0

    // Spring animation configuration
    const springConfig = {
        type: "spring" as const,
        stiffness: 300,
        damping: 30,
        mass: 0.8
    }

    // Animation variants for cards with layout animation
    const cardVariantsWithLayout = {
        hidden: {
            opacity: 0,
            scale: 0.8,
            y: 20
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: springConfig
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            y: -20,
            transition: {
                ...springConfig,
                duration: 0.2
            }
        }
    }

    // Animation variants for cards without layout animation (fade only)
    const cardVariantsFadeOnly = {
        hidden: {
            opacity: 0,
            scale: 0.8,
            y: 20
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: springConfig
        },
        exit: {
            opacity: 0,
            transition: {
                duration: 0.3,
                ease: [0.4, 0.0, 0.2, 1] as const
            }
        }
    }

    return (
        <>
            <ArticleFilter
                articles={articles}
                sortOrder={sortOrder}
                onFilteredArticlesChange={setFilteredArticles}
            />
            <motion.div
                className="grid grid-cols-1 gap-6 mt-4"
                layout={hasResults}
            >
                <AnimatePresence mode={hasResults ? "popLayout" : "wait"}>
                    {filteredArticles.map((article: PostMetadata) => (
                        <motion.div
                            key={article.id}
                            layout={hasResults}
                            variants={hasResults ? cardVariantsWithLayout : cardVariantsFadeOnly}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            layoutId={hasResults ? `article-${article.id}` : undefined}
                            transition={hasResults ? springConfig : { duration: 0.3 }}
                        >
                            <ArticleCard
                                linkParam={linkParam}
                                article={article}
                                showTime={showTime}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </>
    )
}
