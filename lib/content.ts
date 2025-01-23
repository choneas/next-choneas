"use server"

import { NotionAPI } from "notion-client";
import { type ExtendedRecordMap } from "notion-types";
import { idToUuid, defaultMapImageUrl } from "notion-utils";
import { getTranslations } from "next-intl/server";
import { authors } from "@/data/authors";
import type { ArticleMetadata, PropertySchema } from "@/types/content";
import type { Author } from "@/types/author";

const notion = new NotionAPI({
    // authToken: process.env.NOTION_AUTH_TOKEN,
    // activeUser: process.env.NOTION_ACTIVE_USER,
});

let cachedRootPage: ExtendedRecordMap | null = null;
let cachedRootPageTimestamp: number | null = null;
let cachedPropertySchemas: PropertySchema[] | null = null;

async function getRootPage() {
    if (!cachedRootPage || (cachedRootPageTimestamp && Date.now() - cachedRootPageTimestamp > 3600000)) {
        cachedRootPage = await notion.getPage(process.env.NOTION_ROOT_PAGE_ID!);
        cachedRootPageTimestamp = Date.now();
    }
    return cachedRootPage;
}

async function getResolvedPropertyNames(): Promise<PropertySchema[]> {
    if (cachedPropertySchemas) return cachedPropertySchemas;
    
    const rootPage = await getRootPage();
    const collection = rootPage.collection[idToUuid(process.env.NOTION_ROOT_COLLECTION_ID!)];
    const schema = collection.value.schema;
    
    cachedPropertySchemas = Object.entries(schema).map(([prop, value]) => ({
        prop,
        name: value.name,
        type: value.type,
        options: value.options
    }));
    
    return cachedPropertySchemas;
}

async function getAllArticles(): Promise<ArticleMetadata[]> {
    const rootPage = await getRootPage();
    const processedIds = new Set<string>();
    const articles: ArticleMetadata[] = [];
    
    // 遍历所有blocks，找出文章页面
    for (const [id, block] of Object.entries(rootPage.block)) {
        if (block?.value?.type === 'page' && 
            block?.value?.parent_table === 'collection') {
            // 如果这个ID已经处理过，跳过
            if (processedIds.has(id)) continue;
            
            const metadata = await generateArticleMetadata(rootPage, id);
            processedIds.add(id);
            articles.push(metadata);
        }
    }
    
    return articles;
}

// 修改 NotionBlock 接口
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

class ArticleNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ArticleNotFoundError";
    }
}

async function getArticle(slugOrId: string) {
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
    const metadata = await generateArticleMetadata(recordMap, targetId);
    return { recordMap, metadata };
}

async function generateArticleMetadata(
    recordMap: ExtendedRecordMap,
    pageId: string
): Promise<ArticleMetadata> {
    const t = await getTranslations("Tag");
    const resolvedPageId = pageId.length === 32 ? idToUuid(pageId) : pageId;
    const page = recordMap.block[resolvedPageId].value;
    const properties = page.properties;
    const propertySchemas = await getResolvedPropertyNames();

    const metadata: ArticleMetadata = {
        notionid: pageId,  // 这是32位的 UUID
        title: '', // 稍后设置
        created_date: new Date(page.created_time),
        last_edit_date: new Date(page.last_edited_time)
    };

    // ID 属性的特殊处理
    if (properties['XwwZ']?.[0]?.[0]) {
        metadata.id = properties['XwwZ'][0][0];  // 设置数字 ID
    }

    // 遍历属性模式映射数据
    propertySchemas.forEach(schema => {
        const value = properties[schema.prop]?.[0];
        if (!value) return;

        switch (schema.type) {
            case 'title':
                metadata.title = value[0] || '';
                break;
            case 'text':
                if (schema.name === 'Description') metadata.description = value[0];
                if (schema.name === 'Slug') metadata.slug = value[0];
                if (schema.name === 'ID') metadata.id = value[0];
                break;
            case 'multi_select':
                if (schema.name === 'Category') metadata.category = value[0].split(',').map((tag: string) => t(tag));
                break;
            case 'person':
                if (schema.name === 'Author') {
                    const authorUuids = value[1]?.map((user: [string, string]) => user[1]) || [];
                    metadata.author = authorUuids
                        .map((uuid: string) => authors.find(author => author.uuid === uuid))
                        .filter((author: Author | undefined): author is Author => author !== undefined);
                }
                break;
            case 'checkbox':
                if (schema.name === 'Draft') metadata.draft = value[0] === 'Yes';
                break;
            case 'id':
                if (schema.name === 'ID') metadata.id = value[0];
                break;
        }
    });

    // 处理封面相关信息
    if (page.format && page.format.page_cover) {
        metadata.cover = defaultMapImageUrl(page.format.page_cover, page);
        metadata.cover_preview = defaultMapImageUrl(page.format.social_media_image_preview_url, page);
        metadata.cover_position = page.format.page_cover_position;
    }

    return metadata;
}

export {
    getArticle,
    getAllArticles,
    ArticleNotFoundError
}