import { create } from 'zustand';
import type { PostMetadata } from '@/types/content';

interface PostMetadataStore {
    PostMetadata?: PostMetadata
    setPostMetadata?: (article: PostMetadata) => void
}

export const usePostMetadata = create<PostMetadataStore>((set) => ({
    PostMetadata: {
        title: '',
        created_date: new Date,
        last_edit_date: new Date
    },
    setPostMetadata: (article: PostMetadata) => set({ PostMetadata: article })
}));