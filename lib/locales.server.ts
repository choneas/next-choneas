import fs from 'fs';
import path from 'path';

/**
 * Default locale used as fallback when no match is found
 */
export const DEFAULT_LOCALE = 'en';

/**
 * Internal function to scan locales directory (synchronous, no caching)
 */
function scanLocalesSync(): string[] {
    const localesDir = path.join(process.cwd(), 'locales');
    const files = fs.readdirSync(localesDir);

    // Filter JSON files and extract locale codes
    const locales = files
        .filter(file => file.endsWith('.json'))
        .map(file => file.replace('.json', ''));

    // Ensure default locale exists
    if (!locales.includes(DEFAULT_LOCALE)) {
        throw new Error(
            `Default locale "${DEFAULT_LOCALE}.json" is missing in locales/ directory`
        );
    }

    return locales;
}

/**
 * Scans the locales/ directory and returns a list of available locale codes.
 * Use this in Server Components and Server Actions.
 * 
 * Note: Caching is handled at a higher level (in request.ts) to avoid
 * "use cache" file restrictions.
 * 
 * @returns Array of locale codes (e.g., ['en', 'zh-CN', 'es'])
 * @throws Error if the default locale 'en.json' is missing
 */
export async function getSupportedLocales(): Promise<string[]> {
    return scanLocalesSync();
}

/**
 * Synchronous version of getSupportedLocales for use in middleware
 * where async is not available.
 * 
 * @returns Array of locale codes (e.g., ['en', 'zh-CN', 'es'])
 * @throws Error if the default locale 'en.json' is missing
 */
export function getSupportedLocalesSync(): string[] {
    return scanLocalesSync();
}

/**
 * Parses the HTTP Accept-Language header and returns an ordered list of preferred locales.
 * 
 * @param acceptLanguage - The Accept-Language header value (e.g., "en-US,en;q=0.9,zh-CN;q=0.8")
 * @returns Array of locale codes in priority order (e.g., ['en-US', 'en', 'zh-CN'])
 */
export function parseAcceptLanguage(acceptLanguage: string): string[] {
    try {
        return acceptLanguage
            .split(',')
            .map(lang => {
                const [locale] = lang.trim().split(';');
                return locale;
            })
            .filter(Boolean);
    } catch (error) {
        console.warn('Failed to parse Accept-Language header:', error);
        return [];
    }
}

/**
 * Finds the best matching locale from user preferences against supported locales.
 * Matching strategy:
 * 1. Exact match (e.g., "zh-CN" === "zh-CN")
 * 2. Language code match (e.g., "zh" matches "zh-CN")
 * 3. Fallback to DEFAULT_LOCALE
 * 
 * @param preferredLocales - User's preferred locales in priority order
 * @param supportedLocales - Available locales in the application
 * @returns The best matching locale code
 */
export function findBestMatch(
    preferredLocales: string[],
    supportedLocales: string[]
): string {
    for (const locale of preferredLocales) {
        // Try exact match first
        if (supportedLocales.includes(locale)) {
            return locale;
        }

        // Try language code match (e.g., "zh" matches "zh-CN")
        const langCode = locale.split('-')[0];
        const match = supportedLocales.find(supported =>
            supported.startsWith(langCode)
        );
        if (match) {
            return match;
        }
    }

    // Fallback to default locale
    return DEFAULT_LOCALE;
}
