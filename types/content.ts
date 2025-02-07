import type { TableOfContentsEntry } from 'notion-utils'
import type { Author } from '@/types/author'

export interface PostMetadata {
    id?: string
    notionid?: string
    title: string
    type?: "Article" | "Tweet"
    slug?: string
    author?: Author[]
    category?: string[]
    description?: string
    toc?: TableOfContentsEntry[]
    icon?: string
    cover?: string
    cover_preview?: string
    cover_position?: number
    photos?: string[]
    created_date: Date
    last_edit_date: Date
}

export interface PropertySchema {
    prop: string
    name: string
    type: string
    options?: Array<{
        id: string
        color: string
        value: string
    }>
}