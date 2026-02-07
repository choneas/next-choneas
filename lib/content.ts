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
 * Get all page IDs from the Notion collection
 * Uses getCollectionData to fetch pages from the collection
 */
async function getCollectionPageIds(): Promise<string[]> {
    const rootPage = await getCachedRootPage();
    const collectionId = process.env.NOTION_ROOT_COLLECTION_ID;

    if (!collectionId) {
        console.error('NOTION_ROOT_COLLECTION_ID is not set');
        return [];
    }

    // Convert collection ID to UUID format (with hyphens)
    const normalizedCollectionId = idToUuid(collectionId);

    // Find the first available collection view
    const collectionView = Object.entries(rootPage.collection_view || {})[0];
    if (!collectionView) {
        console.error('No collection views found');
        return [];
    }

    const [viewId] = collectionView;

    try {
        // Fetch collection data using the NotionAPI
        const collectionData = await notion.getCollectionData(
            normalizedCollectionId,
            viewId,
            {}, // query
            { limit: 1000 } // Get all pages
        );

        // Extract page IDs from the result
        return collectionData.result?.reducerResults?.collection_group_results?.blockIds || [];
    } catch (error) {
        console.error('Failed to fetch collection data:', error);
        return [];
    }
}

/**
 * Get all posts data (cached, no translation)
 * Translation happens at component level with locale passed in
 */
const getCachedAllPostsData = unstable_cache(
    async (locale: string): Promise<CachedPostsData> => {
        const pageIds = await getCollectionPageIds();
        const processedIds = new Set<string>();
        const articles: RawPostMetadata[] = [];
        const tweets: RawPostMetadata[] = [];

        for (const id of pageIds) {
            if (processedIds.has(id)) continue;

            try {
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
            } catch (error) {
                console.error(`Failed to process post ${id}:`, error);
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



/**
 * Find target page ID from slug or ID
 */
async function findTargetPageId(slugOrId: string): Promise<string | undefined> {
    // UUID format - try to fetch directly
    if (slugOrId.length === 32) {
        try {
            await notion.getPage(slugOrId);
            return slugOrId;
        } catch {
            return undefined;
        }
    }

    // Get all pages from collection
    const pageIds = await getCollectionPageIds();

    // Numeric ID or Slug - need to check each page
    for (const id of pageIds) {
        try {
            const recordMap = await getCachedPost(id);
            const block = recordMap.block?.[id]?.value;

            if (!block) {
                continue;
            }

            if (/^\d+$/.test(slugOrId)) {
                // Numeric ID lookup
                const pageId = getPageProperty('ID', block, recordMap);
                if (pageId === slugOrId) {
                    return id;
                }
            } else {
                // Slug lookup
                const pageSlug = getPageProperty('Slug', block, recordMap);
                if (pageSlug === slugOrId) {
                    return id;
                }
            }
        } catch (error) {
            console.error(`Failed to check page ${id}:`, error);
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
    getCachedAllPostsData as getAllPostsRaw
}
export default ArticleNotFoundError
