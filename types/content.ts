import type { TableOfContentsEntry } from 'notion-utils'
interface Author {
    uuid: string
    name: string
    avatar: string
}


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
    last_edited_time: Date
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