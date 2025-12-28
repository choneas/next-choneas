"use server"

import type { ExtendedRecordMap, PageBlock } from "notion-types";
import { idToUuid, defaultMapImageUrl, getPageTableOfContents, getPageProperty } from "notion-utils";
import { unstable_cache } from "next/cache";
import { NotionAPI } from "notion-client";
import type { PostMetadata } from "@/types/content";
import { getReadingTime } from "@/utils/read-time";

// Note: The custom Notion proxy is disabled, so we rely on the official SDK directly.
const notion = new NotionAPI({
    authToken: process.env.NOTION_AUTH_TOKEN,
    apiBaseUrl: process.env.NOTION_API_BASE_URL
});

// ============================================================================
// Cached Notion API calls (no cookies/headers dependency)
// ============================================================================

/** Cache root page for 5 minutes */
const getCachedRootPage = unstable_cache(
    async () => {
        try {
            return await notion.getPage(process.env.NOTION_ROOT_PAGE_ID!);
        } catch (error) {
            console.error('Failed to fetch root page:', error);
            throw error;
        }
    },
    ['notion-root-page'],
    { revalidate: 300, tags: ['notion-root'] }
);

/** Cache individual post for 1 minute */
const getCachedPost = unstable_cache(
    async (pageId: string) => {
        try {
            return await notion.getPage(pageId);
        } catch (error) {
            console.error('Failed to fetch post:', error);
            throw error;
        }
    },
    ['notion-post'],
    { revalidate: 60, tags: ['notion-post'] }
);

// ============================================================================
// Helper functions
// ============================================================================

function getTweetImageUrls(recordMap: ExtendedRecordMap, blockId: string): string[] {
    try {
        const block = recordMap.block[blockId]?.value;
        if (!block?.content) return [];

        const images: string[] = [];
        for (const childId of block.content) {
            const child = recordMap.block[childId]?.value;
            if (child?.type === 'image') {
                const source = recordMap.signed_urls?.[child.id] || child.properties?.source?.[0]?.[0];
                if (source && !source.includes('file.notion.so')) {
                    const imageUrl = defaultMapImageUrl(source, child);
                    if (imageUrl) images.push(imageUrl);
                }
            }
        }
        return images.slice(0, 3);
    } catch (error) {
        console.error('Error getting tweet images:', error);
        return [];
    }
}

// ============================================================================
// Raw metadata generation (no translation - cacheable)
// ============================================================================

interface RawPostMetadata extends Omit<PostMetadata, 'tags'> {
    rawTags: string[]; // Untranslated tag keys
}

/**
 * Generate raw post metadata without translation
 * This is cacheable because it doesn't depend on cookies/locale
 */
function generateRawPostMetadata(
    recordMap: ExtendedRecordMap,
    pageId: string,
    locale: string
): RawPostMetadata {
    const resolvedPageId = pageId.length === 32 ? idToUuid(pageId) : pageId;
    const block = recordMap.block[resolvedPageId].value;

    const metadata: RawPostMetadata = {
        notionid: pageId,
        title: getPageProperty('title', block, recordMap) || '',
        created_time: new Date(block.created_time),
        last_edited_time: new Date(block.last_edited_time),
        rawTags: [],
    };

    // Basic properties
    metadata.id = getPageProperty('ID', block, recordMap);
    metadata.slug = getPageProperty('Slug', block, recordMap);
    metadata.description = getPageProperty('Description', block, recordMap);
    metadata.type = getPageProperty('Type', block, recordMap) as "Article" | "Tweet";

    // Raw tags (untranslated)
    const tags = getPageProperty<string[]>('Tags', block, recordMap) || [];
    metadata.rawTags = tags.filter(Boolean);

    // Icon
    if (block.format?.page_icon) {
        metadata.icon = block.format.page_icon;
    }

    // Cover
    if (block.format?.page_cover) {
        metadata.cover = defaultMapImageUrl(block.format.page_cover, block);
        if (block.format.social_media_image_preview_url) {
            metadata.cover_preview = defaultMapImageUrl(block.format.social_media_image_preview_url, block);
        }
        metadata.cover_position = block.format.page_cover_position;
    }

    // Tweet photos
    if (metadata.type === 'Tweet') {
        metadata.photos = getTweetImageUrls(recordMap, pageId);
    }

    // Table of contents
    metadata.toc = getPageTableOfContents(block as PageBlock, recordMap);

    // Reading time (uses locale but doesn't need cookies)
    metadata.readingTime = getReadingTime(recordMap, locale);

    // Platform
    metadata.platform = 'notion';

    return metadata;
}

// ============================================================================
// Cached data fetching (separated from translation)
// ============================================================================

interface CachedPostsData {
    articles: RawPostMetadata[];
    tweets: RawPostMetadata[];
}

/**
 * Get all posts data (cached, no translation)
 * Translation happens at component level with locale passed in
 */
const getCachedAllPostsData = unstable_cache(
    async (locale: string): Promise<CachedPostsData> => {
        const rootPage = await getCachedRootPage();
        const processedIds = new Set<string>();
        const articles: RawPostMetadata[] = [];
        const tweets: RawPostMetadata[] = [];

        for (const [id, block] of Object.entries(rootPage.block)) {
            if (block?.value?.type === 'page' &&
                block?.value?.parent_id === idToUuid(process.env.NOTION_ROOT_COLLECTION_ID)) {
                if (processedIds.has(id)) continue;

                const postRecordMap = await getCachedPost(id);
                const metadata = generateRawPostMetadata(postRecordMap, id, locale);

                if (metadata.description === '无内容' || metadata.description === 'No content') {
                    metadata.description = undefined;
                }

                if (metadata.type === 'Tweet' && Boolean(metadata.id)) {
                    processedIds.add(id);
                    tweets.push(metadata);
                } else if (metadata.type === 'Article' && Boolean(metadata.id)) {
                    processedIds.add(id);
                    articles.push(metadata);
                }
            }
        }

        return { articles, tweets };
    },
    ['notion-all-posts'],
    { revalidate: 300, tags: ['notion-posts', 'notion-root'] }
);

// ============================================================================
// Public API (with translation support)
// ============================================================================

/**
 * Translate raw tags using provided translator function
 * Also ensures dates are proper Date objects (after cache serialization)
 */
function translateMetadata(
    raw: RawPostMetadata,
    translateTag: (key: string) => string
): PostMetadata {
    const { rawTags, ...rest } = raw;
    return {
        ...rest,
        // Ensure dates are Date objects (cache serializes them to strings)
        created_time: new Date(rest.created_time),
        last_edited_time: new Date(rest.last_edited_time),
        tags: rawTags.map(translateTag),
    };
}

/**
 * Get all posts with translated tags
 * @param translateTag - Function to translate tag keys (from getTranslations("Tag"))
 * @param locale - Current locale for reading time calculation
 * @param includeSocial - Whether to include social media posts
 */
async function getAllPosts(
    translateTag: (key: string) => string,
    locale: string,
    includeSocial: boolean = true
) {
    const cached = await getCachedAllPostsData(locale);

    const articles = cached.articles.map(raw => translateMetadata(raw, translateTag));
    const tweets = cached.tweets.map(raw => translateMetadata(raw, translateTag));

    // Include social media posts if enabled
    if (includeSocial) {
        const { getAllSocialPosts } = await import('@/lib/social-feeds');
        const socialPosts = await getAllSocialPosts();
        tweets.push(...socialPosts);
    }

    return { articles, tweets };
}

// ============================================================================
// Single post fetching
// ============================================================================

class ArticleNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ArticleNotFoundError";
    }
}

interface NotionBlock {
    value: {
        type: string;
        parent_table: string;
        properties: {
            'XwwZ'?: [[string]];  // ID property
            '}YdW'?: [[string]];  // Slug property
            [key: string]: [[string]] | undefined;
        };
    };
}

/**
 * Find target page ID from slug or ID
 */
async function findTargetPageId(slugOrId: string): Promise<string | undefined> {
    const rootPage = await getCachedRootPage();

    // UUID format
    if (slugOrId.length === 32) {
        return slugOrId;
    }

    // Numeric ID
    if (/^\d+$/.test(slugOrId)) {
        for (const [id, block] of Object.entries(rootPage.block)) {
            const typedBlock = block as NotionBlock;
            if (typedBlock?.value?.type === 'page' &&
                typedBlock?.value?.parent_table === 'collection' &&
                typedBlock?.value?.properties?.['XwwZ']?.[0]?.[0] === slugOrId) {
                return id;
            }
        }
        return undefined;
    }

    // Slug
    for (const [id, block] of Object.entries(rootPage.block)) {
        const typedBlock = block as NotionBlock;
        if (typedBlock?.value?.type === 'page' &&
            typedBlock?.value?.parent_table === 'collection' &&
            typedBlock?.value?.properties?.['}YdW']?.[0]?.[0] === slugOrId) {
            return id;
        }
    }
    return undefined;
}

/**
 * Get single post with translated tags (for server components)
 */
async function getPost(
    slugOrId: string,
    translateTag: (key: string) => string,
    locale: string,
    allowTweet?: boolean
) {
    const targetId = await findTargetPageId(slugOrId);

    if (!targetId) {
        throw new ArticleNotFoundError('Article not found: ' + slugOrId);
    }

    const recordMap = await getCachedPost(targetId);
    const rawMetadata = generateRawPostMetadata(recordMap, targetId, locale);
    const metadata = translateMetadata(rawMetadata, translateTag);

    if (!allowTweet && metadata.type === 'Tweet') {
        throw new ArticleNotFoundError('Article not found');
    }

    return { recordMap, metadata };
}

/**
 * Get post record map only (for client components that only need content)
 * No translation needed - just returns the Notion data
 */
async function getPostRecordMap(slugOrId: string, allowTweet?: boolean) {
    const targetId = await findTargetPageId(slugOrId);

    if (!targetId) {
        throw new ArticleNotFoundError('Article not found: ' + slugOrId);
    }

    const recordMap = await getCachedPost(targetId);
    const resolvedPageId = targetId.length === 32 ? idToUuid(targetId) : targetId;
    const block = recordMap.block[resolvedPageId].value;
    const type = getPageProperty('Type', block, recordMap) as "Article" | "Tweet";

    if (!allowTweet && type === 'Tweet') {
        throw new ArticleNotFoundError('Article not found');
    }

    return { recordMap };
}

export {
    getPost,
    getPostRecordMap,
    getAllPosts,
    ArticleNotFoundError
}
