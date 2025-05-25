"use server"

import { NotionAPI } from "notion-client";
import type { ExtendedRecordMap, PageBlock } from "notion-types";
import { idToUuid, defaultMapImageUrl, getPageTableOfContents, getPageProperty } from "notion-utils";
import { getTranslations } from "next-intl/server";
import type { PostMetadata } from "@/types/content";

const notion = new NotionAPI();

const CACHE_DURATION = process.env.NODE_ENV === 'development' ? 1000 : 5 * 60 * 1000;
let cachedRootPage: ExtendedRecordMap | null = null;
let cachedRootPageTimestamp: number | null = null;

async function getRootPage() {
    try {
        if (!cachedRootPage || (cachedRootPageTimestamp && Date.now() - cachedRootPageTimestamp > CACHE_DURATION)) {
            cachedRootPage = await notion.getPage(process.env.NOTION_ROOT_PAGE_ID!);
            cachedRootPageTimestamp = Date.now();
        }
        return cachedRootPage;
    } catch (error) {
        console.error('Failed to fetch root page:', error);
        throw error;
    }
}

function getTweetImageUrls(
    recordMap: ExtendedRecordMap,
    blockId: string
): string[] {
    try {
        const block = recordMap.block[blockId]?.value;
        if (!block?.content) return [];

        const images: string[] = [];

        for (const childId of block.content) {
            const child = recordMap.block[childId]?.value;
            if (child?.type === 'image') {
                const source = recordMap.signed_urls?.[child.id] ||
                    child.properties?.source?.[0]?.[0];

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

async function generatePostMetadata(
    recordMap: ExtendedRecordMap,
    pageId: string
): Promise<PostMetadata> {
    const t = await getTranslations("Tag");
    const resolvedPageId = pageId.length === 32 ? idToUuid(pageId) : pageId;
    const block = recordMap.block[resolvedPageId].value;

    try {
        const metadata: PostMetadata = {
            notionid: pageId,
            title: getPageProperty('title', block, recordMap) || '',
            created_date: new Date(block.created_time),
            last_edit_date: new Date(block.last_edited_time)
        };

        // 获取基本属性
        metadata.id = getPageProperty('ID', block, recordMap);
        metadata.slug = getPageProperty('Slug', block, recordMap);
        metadata.description = getPageProperty('Description', block, recordMap);
        metadata.type = getPageProperty('Type', block, recordMap) as "Article" | "Tweet";

        // 处理分类
        const categories = getPageProperty<string[]>('Category', block, recordMap) || [];
        metadata.category = categories.filter(Boolean).map(tag => t(tag));

        // 处理图标
        if (block.format?.page_icon) {
            metadata.icon = block.format.page_icon;
        }

        // 处理封面
        if (block.format?.page_cover) {
            metadata.cover = defaultMapImageUrl(block.format.page_cover, block);
            if (block.format.social_media_image_preview_url) {
                metadata.cover_preview = defaultMapImageUrl(block.format.social_media_image_preview_url, block);
            }
            metadata.cover_position = block.format.page_cover_position;
        }

        // 处理推文图片
        if (metadata.type === 'Tweet') {
            metadata.photos = getTweetImageUrls(recordMap, pageId);
        }

        // 获取目录
        metadata.toc = getPageTableOfContents(block as PageBlock, recordMap);

        return metadata;
    } catch (error) {
        console.error('Error generating post metadata:', error);
        throw error;
    }
}

async function getAllPosts() {
    const rootPage = await getRootPage();
    const processedIds = new Set<string>();
    const articles: PostMetadata[] = [];
    const tweets: PostMetadata[] = [];

    for (const [id, block] of Object.entries(rootPage.block)) {
        if (block?.value?.type === 'page' &&
            block?.value?.parent_id === idToUuid(process.env.NOTION_ROOT_COLLECTION_ID)) {
            if (processedIds.has(id)) continue;

            const metadata = await generatePostMetadata(rootPage, id);
            
            if (metadata.description === '无内容' || metadata.description === 'No content') metadata.description = undefined

            if (metadata.type === 'Tweet' && Boolean(metadata.id)) {
                processedIds.add(id)
                tweets.push(metadata);
            } else if (metadata.type === 'Article' && Boolean(metadata.id)) {
                processedIds.add(id)
                articles.push(metadata);
            }
        }
    }

    return { articles, tweets };
}

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

async function getPost(slugOrId: string, allowTweet?: boolean) {
    const rootPage = await getRootPage();
    let targetId: string | undefined;

    // 如果是标准 UUID 格式，直接使用
    if (slugOrId.length === 32) {
        targetId = slugOrId;
    }
    // 如果是纯数字ID
    else if (/^\d+$/.test(slugOrId)) {
        for (const [id, block] of Object.entries(rootPage.block)) {
            const typedBlock = block as NotionBlock;
            if (typedBlock?.value?.type === 'page' &&
                typedBlock?.value?.parent_table === 'collection' &&
                typedBlock?.value?.properties?.['XwwZ']?.[0]?.[0] === slugOrId) {
                targetId = id;
                break;
            }
        }
    }
    // 如果是 slug
    else {
        for (const [id, block] of Object.entries(rootPage.block)) {
            const typedBlock = block as NotionBlock;
            if (typedBlock?.value?.type === 'page' &&
                typedBlock?.value?.parent_table === 'collection' &&
                typedBlock?.value?.properties?.['}YdW']?.[0]?.[0] === slugOrId) {
                targetId = id;
                break;
            }
        }
    }


    if (!targetId) {
        throw new ArticleNotFoundError('Article not found');
    }

    const recordMap = await notion.getPage(targetId);
    const metadata = await generatePostMetadata(recordMap, targetId);


    if (!allowTweet && metadata.type === 'Tweet') {
        throw new ArticleNotFoundError('Article not found');
    }

    return { recordMap, metadata };
}

export {
    getPost,
    getAllPosts,
    ArticleNotFoundError
}