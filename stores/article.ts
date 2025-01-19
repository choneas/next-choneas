import { create } from 'zustand';
import type { ArticleMetadata } from '@/types/content';

interface ArticleMetadataStore {
    ArticleMetadata?: ArticleMetadata
    setArticleMetadata?: (article: ArticleMetadata) => void
}

export const useArticleMetadata = create<ArticleMetadataStore>((set) => ({
    ArticleMetadata: {
        title: ''
    },
    setArticleMetadata: (article: ArticleMetadata) => set({ ArticleMetadata: article })
}));