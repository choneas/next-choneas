"use client"

import { useTranslations } from "next-intl"
import { Select, ListBox, Label, TextField, Input } from "@heroui/react"
import type { Key } from "@react-types/shared"

interface ArticleFilterProps {
    tags: string[]
    selectedTags: Key[]
    onSelectedTagsChange: (tags: Key[]) => void
    searchValue: string
    onSearchChange: (value: string) => void
}

export function ArticleFilter({
    tags,
    selectedTags,
    onSelectedTagsChange,
    searchValue,
    onSearchChange
}: ArticleFilterProps) {
    const t = useTranslations("Article-Filter")

    const getSelectedTagsText = () => {
        if (selectedTags.length === 0) {
            return ""
        }
        return selectedTags.join(", ")
    }

    return (
        <div className="grid grid-rows-2 md:grid-rows-1 md:grid-cols-5 gap-4">
            <TextField className="md:col-span-3">
                <Label>{t('label-search')}</Label>
                <Input
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={t('placeholder-search')}
                />
            </TextField>

            <div className="md:col-span-2">
                <Select
                    selectionMode="multiple"
                    placeholder={t('placeholder-tags')}
                    value={selectedTags}
                    onChange={(value) => onSelectedTagsChange(value as Key[])}
                >
                    <Label>{t('label-tags')}</Label>
                    <Select.Trigger>
                        <Select.Value>
                            {getSelectedTagsText()}
                        </Select.Value>
                        <Select.Indicator />
                    </Select.Trigger>
                    <Select.Content>
                        <ListBox
                            selectionMode="multiple"
                        >
                            {tags.map(tag => (
                                <ListBox.Item key={tag} id={tag} textValue={tag}>
                                    {tag}
                                    <ListBox.ItemIndicator />
                                </ListBox.Item>
                            ))}
                        </ListBox>
                    </Select.Content>
                </Select>
            </div>
        </div>
    )
}
