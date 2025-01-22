"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Select, SelectItem, Selection, Input } from "@heroui/react"
import { IoSearch } from "react-icons/io5";
import type { ArticleMetadata } from "@/types/content"

function parseCategories(articles: ArticleMetadata[]): string[] {
    const categorySet = new Set<string>();
    articles.forEach(article => {
        article.category?.forEach(category => {
            categorySet.add(category);
        });
    });
    return Array.from(categorySet);
}

export function ArticleFilter({
    articles,
    onFilterChange
}: {
    articles: ArticleMetadata[]
    onFilterChange?: (filter: { category?: string[], search?: string }) => void
}) {
    const t = useTranslations("Article-Filter")
    const [categories, setCategories] = useState<string[]>([])
    const [selectedCategories, setSelectedCategories] = useState<Selection>(new Set([]))

    const [searchValue, setSearchValue] = useState('')

    useEffect(() => {
        setCategories(parseCategories(articles))
    }, [articles])

    useEffect(() => {
        onFilterChange?.({
            category: selectedCategories instanceof Set && selectedCategories.size > 0 ? Array.from(selectedCategories).map(String) : undefined,
            search: searchValue || undefined
        })
    }, [selectedCategories, searchValue, onFilterChange])

    return (
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
    )
}