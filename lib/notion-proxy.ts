import { NotionAPI } from "notion-client";

/**
 * Notion 代理配置
 * 用于中国大陆用户通过代理服务器访问 Notion API
 */
interface ProxyConfig {
    /** Notion 域名代理地址 */
    notionDomain: string;
    /** S3 存储代理地址 */
    s3Domain: string;
    /** 是否启用代理 */
    enabled: boolean;
}

/**
 * 从环境变量读取代理配置
 */
const PROXY_CONFIG: ProxyConfig = {
    notionDomain: process.env.NOTION_PROXY_DOMAIN || '154.40.44.47',
    s3Domain: process.env.NOTION_S3_PROXY_DOMAIN || '101.32.183.34',
    enabled: process.env.ENABLE_NOTION_PROXY === 'true'
};

/**
 * 转换 URL 以使用代理服务器
 * @param url 原始 URL
 * @returns 代理 URL 或原始 URL
 */
function transformUrlToProxy(url: string): string {
    if (!PROXY_CONFIG.enabled) {
        return url;
    }

    let transformedUrl = url;

    if (url.includes('notion.so')) {
        transformedUrl = url.replace(/notion\.so/g, PROXY_CONFIG.notionDomain);
    }

    // 代理 S3 存储域名
    if (url.includes('s3.us-west-2.amazonaws.com')) {
        transformedUrl = url.replace(/s3\.us-west-2\.amazonaws\.com/g, PROXY_CONFIG.s3Domain);
    }

    return transformedUrl;
}

// 保存原始 fetch 引用，避免递归调用
const originalFetch = global.fetch;

/**
 * 自定义 fetch 函数，支持代理和回退机制
 */
async function proxyFetch(url: string, options?: RequestInit): Promise<Response> {
    const proxyUrl = transformUrlToProxy(url);

    // 如果 URL 没有被转换（不需要代理），直接访问
    if (proxyUrl === url) {
        return originalFetch(url, options);
    }

    try {
        // 尝试通过代理访问
        console.log('[Notion Proxy] Fetching via proxy:', {
            original: url,
            proxy: proxyUrl
        });

        const response = await originalFetch(proxyUrl, options);

        // 检查响应状态
        if (!response.ok) {
            console.warn('[Notion Proxy] Proxy response not OK:', {
                status: response.status,
                statusText: response.statusText,
                url: proxyUrl
            });
        }

        return response;
    } catch (error) {
        // 代理失败，回退到直接访问
        console.error('[Notion Proxy] Proxy failed, falling back to direct access:', {
            error: error instanceof Error ? error.message : String(error),
            originalUrl: url,
            proxyUrl: proxyUrl
        });

        try {
            return await originalFetch(url, options);
        } catch (fallbackError) {
            console.error('[Notion Proxy] Direct access also failed:', {
                error: fallbackError instanceof Error ? fallbackError.message : String(fallbackError),
                url: url
            });
            throw fallbackError;
        }
    }
}

/**
 * 创建带有代理支持的 Notion 客户端
 * 
 * 功能特性：
 * - 自动检测环境变量配置
 * - 支持 notion.so 和 S3 域名代理
 * - 代理失败时自动回退到直接访问
 * - 详细的错误日志记录
 * 
 * @returns NotionAPI 客户端实例
 */
export function createNotionClient(): NotionAPI {
    // 如果未启用代理，返回标准客户端
    if (!PROXY_CONFIG.enabled) {
        console.log('[Notion Proxy] Proxy disabled, using direct connection');
        return new NotionAPI();
    }

    console.log('[Notion Proxy] Proxy enabled:', {
        notionDomain: PROXY_CONFIG.notionDomain,
        s3Domain: PROXY_CONFIG.s3Domain
    });

    // 创建客户端实例
    const client = new NotionAPI();

    // 包装客户端方法以使用代理 fetch
    const originalGetPage = client.getPage.bind(client);
    client.getPage = async function (...args) {
        // 临时替换 fetch
        const tempFetch = global.fetch;
        global.fetch = proxyFetch as typeof fetch;
        try {
            return await originalGetPage(...args);
        } finally {
            // 恢复原始 fetch
            global.fetch = tempFetch;
        }
    };

    return client;
}

/**
 * 获取当前代理配置（用于调试）
 */
export function getProxyConfig(): Readonly<ProxyConfig> {
    return { ...PROXY_CONFIG };
}
