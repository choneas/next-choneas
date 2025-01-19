import type { Author } from './author'

export interface ArticleMetadata {
    id?: string
    notionid?: string
    title: string
    slug?: string
    author?: Author[]
    category?: string[]
    description?: string
    cover?: string
    cover_preview?: string
    cover_position?: number
    created_date?: Date
    last_edit_date?: Date
    draft?: boolean
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