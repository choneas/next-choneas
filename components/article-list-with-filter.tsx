"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Select, SelectItem, Selection, Input } from "@heroui/react"
import { IoSearch } from "react-icons/io5"
import type { ArticleMetadata } from "@/types/content"
import { ArticleCard } from "./article-card"

function parseCategories(articles: ArticleMetadata[]): string[] {
    const categorySet = new Set<string>();
    articles.forEach(article => {
        article.category?.forEach(category => {
            categorySet.add(category);
        });
    });
    return Array.from(categorySet);
}

export function ArticleListWithFilter({
    articles,
    sortOrder = 'desc'
}: {
    articles: ArticleMetadata[]
    sortOrder?: 'asc' | 'desc'
}) {
    const t = useTranslations("Article-Filter")
    const [categories, setCategories] = useState<string[]>([])
    const [selectedCategories, setSelectedCategories] = useState<Selection>(new Set([]))
    const [searchValue, setSearchValue] = useState('')

    useEffect(() => {
        setCategories(parseCategories(articles))
    }, [articles])

    const filteredArticles = articles.filter(article => {
        // 分类筛选
        if (selectedCategories instanceof Set && selectedCategories.size > 0) {
            const categoryArray = Array.from(selectedCategories).map(String)
            if (!article.category || !categoryArray.some(t => article.category?.includes(t))) {
                return false
            }
        }

        // 搜索筛选
        if (searchValue) {
            const searchLower = searchValue.toLowerCase()
            const titleMatch = article.title.toLowerCase().includes(searchLower)
            const descriptionMatch = article.description?.toLowerCase().includes(searchLower)
            if (!titleMatch && !descriptionMatch) {
                return false
            }
        }

        return true
    }).sort((a, b) => {
        const timeA = a.created_date ? new Date(a.created_date).getTime() : 0
        const timeB = b.created_date ? new Date(b.created_date).getTime() : 0
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB
    })

    return (
        <>
            <div className="grid grid-rows-2 md:grid-rows-1 md:grid-cols-4 gap-2">
                <Input
                    size="lg"
                    className="md:col-span-3"
                    value={searchValue}
                    onValueChange={setSearchValue}
                    startContent={<IoSearch />}
                    label={t('label-search')}
                    placeholder={t('placeholder-search')}
                />
                <Select
                    size="lg"
                    selectionMode="multiple"
                    className="md:col-span-1"
                    selectedKeys={selectedCategories}
                    onSelectionChange={setSelectedCategories}
                    label={t('label-categories')}
                >
                    {categories.map(category => (
                        <SelectItem key={category} value={category}>
                            {category}
                        </SelectItem>
                    ))}
                </Select>
            </div>

            <div className="grid grid-cols-1 gap-8 mt-4">
                {filteredArticles.length > 0 ?
                    filteredArticles.map((article: ArticleMetadata) => (
                        <ArticleCard
                            key={article.id}
                            linkParam="slug"
                            article={article}
                        />
                    ))
                    :
                    <div className="flex flex-col justify-center items-center h-44">
                        <IoSearch size={48} />
                        <p className="pt-4 text-content4-foreground">{t('not-found')}</p>
                    </div>
                }
            </div>
        </>
    )
}
