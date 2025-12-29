import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';
import {
    getSupportedLocales,
    findBestMatch,
    parseAcceptLanguage
} from '@/lib/locales.server';

export default getRequestConfig(async ({ requestLocale }) => {
    // Use requestLocale if provided (from middleware or URL)
    let locale = await requestLocale;

    if (!locale) {
        const supportedLocales = await getSupportedLocales();
        const cookieStore = await cookies();
        const headersList = await headers();

        // 1. Check user preferred language (cookie)
        const prefLocale = cookieStore.get('NEXT_LOCALE')?.value;
        if (prefLocale && supportedLocales.includes(prefLocale)) {
            locale = prefLocale;
        } else {
            // 2. Check Accept-Language
            const acceptLanguage = headersList.get('Accept-Language') || '';
            const preferredLocales = parseAcceptLanguage(acceptLanguage);
            locale = findBestMatch(preferredLocales, supportedLocales);
        }
    }

    // Ensure we have a valid locale, fallback to first supported locale
    if (!locale) {
        const supportedLocales = await getSupportedLocales();
        locale = supportedLocales[0];
    }

    return {
        locale,
        messages: (await import(`./${locale}.json`)).default
    };
});