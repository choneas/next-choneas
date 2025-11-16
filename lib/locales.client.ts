/**
 * Client-side locale utilities
 * This file contains only client-safe exports (no fs, no "use cache")
 */

/**
 * Default locale used as fallback when no match is found
 */
export const DEFAULT_LOCALE = 'en';

/**
 * Client-side static export of supported locales.
 * This is a hardcoded list that should match the files in locales/ directory.
 * 
 * Note: This list is statically defined for client components.
 * For server components, use getSupportedLocales() from lib/locales.server.ts instead.
 */
export const CLIENT_LOCALES: string[] = ['en', 'zh-CN', 'es'];
