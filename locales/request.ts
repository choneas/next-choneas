import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';
import {
    getSupportedLocales,
    findBestMatch,
    parseAcceptLanguage,
    DEFAULT_LOCALE
} from '@/lib/locales.server';

export default getRequestConfig(async () => {
    const supportedLocales = await getSupportedLocales();
    const cookieStore = await cookies();
    const headersList = await headers();

    // 1. 检查用户首选语言（cookie）
    const prefLocale = cookieStore.get('NEXT_LOCALE')?.value;
    if (prefLocale && supportedLocales.includes(prefLocale)) {
        return {
            locale: prefLocale,
            messages: (await import(`./${prefLocale}.json`)).default
        };
    }

    // 2. 检查 Accept-Language
    const acceptLanguage = headersList.get('Accept-Language') || '';
    const preferredLocales = parseAcceptLanguage(acceptLanguage);
    const locale = findBestMatch(preferredLocales, supportedLocales);

    return {
        locale,
        messages: (await import(`./${locale}.json`)).default
    };
});